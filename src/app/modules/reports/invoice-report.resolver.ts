import { Resolver, Query } from '@nestjs/graphql';
import { ReportsService } from './reports.service';
import { InvoiceReportDto } from './dto/invoice-report.dto';
import { Public } from 'src/app/repository/constants/public-decorator.constants';

@Public()
@Resolver(() => InvoiceReportDto)
export class InvoiceReportResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => InvoiceReportDto)
  async getInvoiceReport(): Promise<InvoiceReportDto> {
    return await this.reportsService.getInvoiceReport();
  }
}

