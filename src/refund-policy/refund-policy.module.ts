import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundPolicyService } from './refund-policy.service';
import { RefundPolicyController } from './refund-policy.controller';
import { RefundPolicy } from './entities/refund-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefundPolicy])],
  controllers: [RefundPolicyController],
  providers: [RefundPolicyService],
  exports: [RefundPolicyService],
})
export class RefundPolicyModule { }
