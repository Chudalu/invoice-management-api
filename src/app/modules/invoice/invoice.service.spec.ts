import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceStatus } from './enum/invoice-status.enum';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { Invoice } from './entities/invoice.entity';
import { getModelToken } from '@nestjs/sequelize';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { LoggedInUserDto } from '../authentication/dto/loggedin-user.dto';
import { InvoiceDto } from './dto/invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let mockInvoice = {
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
  let invoiceArray = [mockInvoice];
  let mockInvoiceRepository = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...mockInvoice })),
    findAll: jest.fn().mockResolvedValue(invoiceArray),
    findByPk: jest.fn().mockResolvedValue(mockInvoice),
    update: jest.fn().mockImplementation((values, query) => mockInvoice),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice),
          useValue: mockInvoiceRepository
        }
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new invoice', async () => {
    let invoice = await service.createInvoice(new LoggedInUserDto(mockUser), { 
      title: 'invoice title',
      amount: 500,
      notes: 'invoice notes'
     });
     expect(invoice).toBeDefined();
     expect(invoice).toBeInstanceOf(InvoiceDto);
  });

  it('should return an array of invoices from search query', async () => {
    let invoices = await service.searchInvoices({ title: 'invoice title'});
    expect(invoices).toBeDefined();
    expect(invoices).toHaveLength(1);
  });

  it('should return one invoice', async () => {
    let invoice = await service.findOneInvoice(1);
    expect(invoice).toBeDefined();
    expect(invoice).toBeInstanceOf(InvoiceDto);
  });
  
});
