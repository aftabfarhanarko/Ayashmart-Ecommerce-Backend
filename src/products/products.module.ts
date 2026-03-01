import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { PublicProductController } from './public-products.controller';
import { ProductsSchedulerService } from './products-scheduler.service';
import { ImageSearchService } from './image-search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { Order } from '../orders/entities/order.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { SystemuserModule } from '../systemuser/systemuser.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, Order]),
    SystemuserModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [ProductController, PublicProductController],
  providers: [ProductService, ProductsSchedulerService, ImageSearchService, JwtAuthGuard, PermissionGuard],
})
export class ProductModule { }
