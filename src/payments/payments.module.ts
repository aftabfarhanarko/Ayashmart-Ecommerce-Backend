import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from '../systemuser/entities/systemuser.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SystemUser]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}