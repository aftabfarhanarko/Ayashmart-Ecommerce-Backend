import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashExpense } from './entities/cash-expense.entity';
import { CashIncome } from './entities/cash-income.entity';
import { SaleInvoice } from '../sale-invoice/entities/sale-invoice.entity';
import { CashService } from './cash.service';
import { CashController } from './cash.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CashExpense, CashIncome, SaleInvoice])],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}
