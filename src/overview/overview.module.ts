import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { User } from '../users/entities/user.entity';
import { Help } from '../help/entities/help.entity';
import { Order } from '../orders/entities/order.entity';
import { Invoice } from '../invoice/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser, User, Help, Order, Invoice])],
  controllers: [OverviewController],
  providers: [OverviewService],
  exports: [OverviewService],
})
export class OverviewModule {}

