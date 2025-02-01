import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '../invoice/entities/invoice.entity';
import { InvoiceReportDto } from './dto/invoice-report.dto';
import { InvoiceStatus } from '../invoice/enum/invoice-status.enum';
import { UserReportDto } from './dto/user-report.dto';
import { User } from '../user/entities/user.entity';
import { RoleEnum } from 'src/app/repository/enum/role.enum';

@Injectable()
export class ReportsService {

  constructor(
    @InjectModel(Invoice) private InvoiceRepository: typeof Invoice,
    @InjectModel(User) private UserRepository: typeof User,
    ) {}

  async getInvoiceReport(): Promise<InvoiceReportDto> {
    let invoiceReport: InvoiceReportDto = {
      totalInvoices: await this.InvoiceRepository.count(),
      paidInvoices: await this.InvoiceRepository.count({ where: { invoiceStatus: InvoiceStatus.PAID } }),
      unpaidInvoices: await this.InvoiceRepository.count({ where: { invoiceStatus: InvoiceStatus.UNPAID } }),
      declinedInvoices: await this.InvoiceRepository.count({ where: { invoiceStatus: InvoiceStatus.DECLINED } })
    };
    return invoiceReport;
  }

  async getUserReport(): Promise<UserReportDto> {
    let userReport: UserReportDto = {
      totalUsers: await this.UserRepository.count(),
      clients: await this.UserRepository.count({ where: { role: RoleEnum.USER } }),
      admins: await this.UserRepository.count({ where: { role: RoleEnum.ADMIN } })
    }
    return userReport;
  }
}
