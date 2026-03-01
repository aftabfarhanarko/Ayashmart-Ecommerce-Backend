import { Controller, Get, Param } from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import { Public } from "../common/decorators/public.decorator";

/**
 * Unified order tracking API.
 * Checks: RedX → Steadfast (scrape) → Pathao → Own Store (internal orders)
 * Public - no auth required.
 */
@Controller("track")
@Public()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(":trackingId")
  async track(@Param("trackingId") trackingId: string) {
    const data = await this.trackingService.trackAnywhere(trackingId);
    return {
      statusCode: 200,
      message: data.courier !== "Unknown" ? "Tracking found" : "Tracking not found",
      data,
    };
  }
}
