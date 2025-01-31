import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from './entities/invoice.entity';
import { InvoiceDto } from './dto/invoice.dto';
import { LoggedInUserDto } from '../authentication/dto/loggedin-user.dto';
import { APIResponseDto } from 'src/app/repository/dto/api-response.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { InvoiceFilter } from './filter/invoice.filter';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectModel(Invoice) private InvoiceRepository: typeof Invoice,
    private notificationService: NotificationService,
  ) {}

  async createInvoice(user: LoggedInUserDto, createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
    let invoice = await this.InvoiceRepository.create({ ...createInvoiceDto, userId: user.id });
    return new InvoiceDto(invoice);
  }

  async searchInvoices(query: InvoiceQueryDto): Promise<InvoiceDto[]> {
    let filter = new InvoiceFilter(query);
    let invoices = await this.InvoiceRepository.findAll({
      where: { ...filter },
      limit: query.limit ? query.limit : 100,
      offset: query.offset ? query.offset : 0,
    });
    return invoices.map(i => new InvoiceDto(i));
  }

  async findOneInvoice(id: number): Promise<InvoiceDto> {
    let invoice = await this.InvoiceRepository.findByPk(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return new InvoiceDto(invoice);
  }

  async update(user: LoggedInUserDto, id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<APIResponseDto> {
    await this.InvoiceRepository.update(updateInvoiceDto, { where: { id, userId: user.id } });
    return new APIResponseDto('Invoice updated');
  }

  async updateInvoiceStatus(updateInvoice: UpdateInvoiceStatusDto): Promise<APIResponseDto> {
    await this.InvoiceRepository.update({ invoiceStatus: updateInvoice.invoiceStatus }, { where: { id: updateInvoice.id }});
    this.notify(updateInvoice.id);
    return new APIResponseDto('Invoice status updated');
  }

  private async notify(id: number) {
    let invoice = await this.findOneInvoice(id);
    await this.notificationService.notifyInvoiceStatus(invoice);
  }

}
