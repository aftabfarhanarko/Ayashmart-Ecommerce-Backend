import { Module } from '@nestjs/common';
import { CartproductsService } from './cartproducts.service';
import { CartproductsController } from './cartproducts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cartproduct } from './entities/cartproduct.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { OrdersModule } from '../orders/orders.module';
import { RequestContextService } from '../common/services/request-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cartproduct, ProductEntity, User]), OrdersModule],
  controllers: [CartproductsController],
  providers: [CartproductsService, RequestContextService],
})
export class CartproductsModule {}
