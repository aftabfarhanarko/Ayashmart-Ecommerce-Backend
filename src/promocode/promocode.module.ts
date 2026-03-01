import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodeEntity } from './entities/promocode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromocodeEntity])],
  controllers: [PromocodeController],
  providers: [PromocodeService],
})
export class PromocodeModule {}
