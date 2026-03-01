import { Controller, Get, Param } from "@nestjs/common";
import { OrderService } from "./orders.service";
import { Public } from "../common/decorators/public.decorator";

/**
 * Public order tracking API.
 * Allows anyone to look up order status by tracking number (no auth required).
 */
@Controller("orders")
@Public()
export class TrackOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("track/:trackingId")
  async track(@Param("trackingId") trackingId: string) {
    const data = await this.orderService.findByTrackingId(trackingId);
    return { statusCode: 200, message: "Order found", data };
  }
}
