import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResellerController } from './reseller.controller';
import { ResellerService } from './reseller.service';
import { ProductEntity } from '../products/entities/product.entity';
import { SaleInvoiceItem } from '../sale-invoice/entities/sale-invoice-item.entity';
import { ResellerPayout } from './entities/reseller-payout.entity';
import { SystemUser } from '../systemuser/entities/systemuser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, SaleInvoiceItem, ResellerPayout, SystemUser]),
  ],
  controllers: [ResellerController],
  providers: [ResellerService],
})
export class ResellerModule {}

