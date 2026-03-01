import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivecyPolicyService } from './privecy-policy.service';
import { PrivecyPolicyController } from './privecy-policy.controller';
import { PrivecyPolicy } from './entities/privecy-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrivecyPolicy])],
  controllers: [PrivecyPolicyController],
  providers: [PrivecyPolicyService],
  exports: [PrivecyPolicyService],
})
export class PrivecyPolicyModule { }
