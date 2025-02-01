import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { InvoiceReportResolver } from './invoice-report.resolver';

describe('InvoiceReportResolver', () => {
  let resolver: InvoiceReportResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceReportResolver, ReportsService],
    }).compile();

    resolver = module.get<InvoiceReportResolver>(InvoiceReportResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
