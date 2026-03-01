import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerEntity } from './entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
