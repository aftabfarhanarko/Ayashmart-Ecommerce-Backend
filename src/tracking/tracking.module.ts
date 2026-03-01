import { Module } from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import { TrackingController } from "./tracking.controller";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
