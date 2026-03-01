import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleInvoice } from './entities/sale-invoice.entity';
import { SaleInvoiceItem } from './entities/sale-invoice-item.entity';
import { SaleInvoiceService } from './sale-invoice.service';
import { SystemuserModule } from '../systemuser/systemuser.module';
import { SaleInvoiceController } from './sale-invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SaleInvoice, SaleInvoiceItem]), SystemuserModule],
  controllers: [SaleInvoiceController],
  providers: [SaleInvoiceService],
  exports: [SaleInvoiceService],
})
export class SaleInvoiceModule {}
