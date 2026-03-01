import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TremsCondetionsService } from './trems-condetions.service';
import { TremsCondetionsController } from './trems-condetions.controller';
import { TremsCondetion } from './entities/trems-condetion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TremsCondetion])],
  controllers: [TremsCondetionsController],
  providers: [TremsCondetionsService],
  exports: [TremsCondetionsService],
})
export class TremsCondetionsModule { }
