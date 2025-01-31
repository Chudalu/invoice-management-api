import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { RepositoryModule } from 'src/app/repository/repository.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [
    RepositoryModule
  ]
})
export class InvoiceModule {}
