import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopProductsController } from './top-products.controller';
import { TopProductsService } from './top-products.service';
import { TopProductsSectionEntity } from './entities/top-products-section.entity';
import { TopProductsItemEntity } from './entities/top-products-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopProductsSectionEntity, TopProductsItemEntity])],
  controllers: [TopProductsController],
  providers: [TopProductsService],
  exports: [TopProductsService],
})
export class TopProductsModule {}

