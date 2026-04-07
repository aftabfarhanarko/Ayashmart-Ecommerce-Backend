import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { TrackOrderController } from './track-order.controller';
import { PaymentsModule } from '../payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { SystemuserModule } from '../systemuser/systemuser.module';
import { VoiceModule } from '../voice/voice.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    PaymentsModule,
    NotificationsModule,
    SystemuserModule,
    forwardRef(() => VoiceModule),
    TypeOrmModule.forFeature([
      Order,
      OrderStatusHistory,
      ProductEntity,
      User,
    ]),
  ],
  controllers: [OrderController, TrackOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrdersModule {}
