import { Resolver, Query } from '@nestjs/graphql';
import { Public } from 'src/app/repository/constants/public-decorator.constants';
import { ReportsService } from '../reports.service';
import { InvoiceReportDto } from '../dto/invoice-report.dto';
import { Roles } from 'src/app/repository/constants/roles-decorator.constants';
import { RoleEnum } from 'src/app/repository/enum/role.enum';

@Public()
@Roles([RoleEnum.ADMIN])
@Resolver(() => InvoiceReportDto)
export class InvoiceReportResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => InvoiceReportDto)
  async getInvoiceReport(): Promise<InvoiceReportDto> {
    return await this.reportsService.getInvoiceReport();
  }
}

