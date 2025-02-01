import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { InvoiceReportResolver } from './invoice-report.resolver';
import { UserReportResolver } from './user-report.resolver';

@Module({
  providers: [
    InvoiceReportResolver, 
    UserReportResolver,
    ReportsService
  ],
  imports: [
    RepositoryModule,
  ],
})
export class ReportsModule {}
