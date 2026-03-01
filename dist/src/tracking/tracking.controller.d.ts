import { TrackingService } from "./tracking.service";
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    track(trackingId: string): Promise<{
        statusCode: number;
        message: string;
        data: import("./tracking.service").UnifiedTrackingResponse;
    }>;
}
