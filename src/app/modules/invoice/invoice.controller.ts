import { Controller, Get, Post, Body, Patch, Param, Req, Query, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoggedInUserDto } from '../authentication/dto/loggedin-user.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { Roles } from 'src/app/repository/constants/roles-decorator.constants';
import { RoleEnum } from 'src/app/repository/enum/role.enum';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(@Req() request: Request, @Body() createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
    let user: LoggedInUserDto = request['user'];
    return await this.invoiceService.createInvoice(user, createInvoiceDto);
  }

  @Get()
  async searchInvoices(@Query() query: InvoiceQueryDto): Promise<InvoiceDto[]> {
    return await this.invoiceService.searchInvoices(query);
  }

  @Get(':id')
  async findOneInvoice(@Param('id', new ParseIntPipe()) id: number) {
    return await this.invoiceService.findOneInvoice(id);
  }

  @Patch(':id')
  async updateInvoice(@Req() request: Request, @Param('id', new ParseIntPipe()) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    let user: LoggedInUserDto = request['user'];
    return await this.invoiceService.update(user, id, updateInvoiceDto);
  }

  @Roles([RoleEnum.ADMIN])
  @Patch('status/:id')
  async updateInvoiceStatus(@Param('id', new ParseIntPipe()) id: number, @Body() updateInvoiceStatus: UpdateInvoiceStatusDto) {
    return await this.invoiceService.updateInvoiceStatus(id, updateInvoiceStatus);
  }
}
