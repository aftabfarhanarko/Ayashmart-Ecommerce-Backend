import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { Invoice } from '../invoice/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser, Invoice])],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}














