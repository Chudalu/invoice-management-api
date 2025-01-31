import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { InvoiceStatus } from './enum/invoice-status.enum';
import { InvoiceDto } from './dto/invoice.dto';
import { APIResponseDto } from 'src/app/repository/dto/api-response.dto';
import { LoggedInUserDto } from '../authentication/dto/loggedin-user.dto';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let mockInvoice: any = {
    id: 1,
    title: 'Invoice for maintenance',
    notes: 'Completion payments on credit services',
    amount: 500,
    invoiceStatus: InvoiceStatus.UNPAID,
    status: EntityStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
  }
  let invoiceArray = [mockInvoice];
  let mockUser: any = {
    id: 1,
    userName: 'firstUser',
    email: 'firstuser@email.com',
    passwordHash: 'passwordHash',
    role: RoleEnum.USER,
    status: EntityStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    notifications: [],
    authentication: null,
  }
  let mockInvoiceService = {
    createInvoice: jest.fn().mockResolvedValue(new InvoiceDto(mockInvoice)),
    searchInvoices: jest.fn().mockResolvedValue(invoiceArray.map(i => new InvoiceDto(i))),
    findOneInvoice: jest.fn().mockResolvedValue(new InvoiceDto(mockInvoice)),
    update: jest.fn().mockResolvedValue(new APIResponseDto('Invoice updated')),
    updateInvoiceStatus: jest.fn().mockResolvedValue(new APIResponseDto('Invoice status updated')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService, useValue: mockInvoiceService
        }
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create invoice', async () => {
    let mockRequest: any = { user: new LoggedInUserDto(mockUser) };
    let invoice = await controller.createInvoice(mockRequest, { 
      title: 'invoice title',
      amount: 500,
      notes: 'invoice notes'
    });
    expect(invoice).toBeDefined();
    expect(invoice).toBeInstanceOf(InvoiceDto);
    expect(mockInvoiceService.createInvoice).toHaveBeenCalled();
  });

  it('should return array of Invoices from search query', async () => {
    let invoices = await controller.searchInvoices({ title: 'invoice title'});
    expect(invoices).toBeDefined();
    expect(invoices).toHaveLength(1);
    expect(mockInvoiceService.searchInvoices).toHaveBeenCalled();
  });

  it('should return one invoice by ID', async () => {
    let invoice = await controller.findOneInvoice(1);
    expect(invoice).toBeDefined();
    expect(invoice).toBeInstanceOf(InvoiceDto);
    expect(mockInvoiceService.findOneInvoice).toHaveBeenCalled();
  });

  it('should update invoice details', async () => {
    let mockRequest: any = { user: new LoggedInUserDto(mockUser) };
    let update = await controller.updateInvoice(mockRequest, 1, { title: 'new title' });
    expect(update).toBeDefined();
    expect(update).toBeInstanceOf(APIResponseDto);
    expect(mockInvoiceService.update).toHaveBeenCalled();
  });

  it('should update invoice status', async () => {
    let update = await controller.updateInvoiceStatus({ id: 1, invoiceStatus: InvoiceStatus.PAID });
    expect(update).toBeDefined();
    expect(update).toBeInstanceOf(APIResponseDto);
    expect(mockInvoiceService.updateInvoiceStatus).toHaveBeenCalled();
  })
});
