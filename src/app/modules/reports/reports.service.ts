import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '../invoice/entities/invoice.entity';
import { InvoiceReportDto } from './dto/invoice-report.dto';
import { InvoiceStatus } from '../invoice/enum/invoice-status.enum';
import { UserReportDto } from './dto/user-report.dto';
import { User } from '../user/entities/user.entity';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ReportsService {

  constructor(
    @InjectModel(Invoice) private InvoiceRepository: typeof Invoice,
    @InjectModel(User) private UserRepository: typeof User,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

  async getInvoiceReport(): Promise<InvoiceReportDto> {
    let cacheKey = 'invoice_report';
    let invoiceReport: InvoiceReportDto; 
    let cachedReport = await this.cacheManager.get<InvoiceReportDto>(cacheKey);
    if (cachedReport) return cachedReport;
    invoiceReport = {
      totalInvoices: await this.InvoiceRepository.count(),
      paidInvoices: await this.InvoiceRepository.count({ where: { invoiceStatus: InvoiceStatus.PAID } }),
      unpaidInvoices: await this.InvoiceRepository.count({ where: { invoiceStatus: InvoiceStatus.UNPAID } }),
      declinedInvoices: await this.InvoiceRepository.count({ where: { invoiceStatus: InvoiceStatus.DECLINED } })
    };
    await this.cacheManager.set(cacheKey, invoiceReport);
    return invoiceReport;
  }

  async getUserReport(): Promise<UserReportDto> {
    let userReport: UserReportDto;
    let cacheKey = 'user_report';
    let cachedReport = await this.cacheManager.get<UserReportDto>(cacheKey);
    if (cachedReport) return cachedReport;
    userReport = {
      totalUsers: await this.UserRepository.count(),
      clients: await this.UserRepository.count({ where: { role: RoleEnum.USER } }),
      admins: await this.UserRepository.count({ where: { role: RoleEnum.ADMIN } })
    }
    await this.cacheManager.set(cacheKey, userReport);
    return userReport;
  }
}
