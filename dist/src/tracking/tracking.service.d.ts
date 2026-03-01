import { ConfigService } from "@nestjs/config";
import { OrderService } from "../orders/orders.service";
export interface TrackingItem {
    messageEn: string;
    messageBn: string;
    status: string;
    groupedStatus: string;
    action: string;
    time: string;
    reason?: string;
    previousStatus?: string;
}
export interface UnifiedTrackingResponse {
    isError: boolean;
    courier: string;
    tracking_id: string;
    status: string;
    tracking: TrackingItem[];
    raw?: Record<string, unknown>;
}
export declare class TrackingService {
    private readonly configService;
    private readonly orderService;
    constructor(configService: ConfigService, orderService: OrderService);
    private static readonly STATUS_BN;
    private translateToBangla;
    private toTrackingItems;
    private trackRedX;
    private trackSteadfast;
    private trackPathao;
    private orderStatusToTracking;
    private trackOurOwn;
    trackAnywhere(trackingId: string): Promise<UnifiedTrackingResponse>;
}
