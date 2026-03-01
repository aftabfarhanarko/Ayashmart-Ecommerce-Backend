import { EarningsService } from './earnings.service';
export declare class EarningsController {
    private readonly earningsService;
    constructor(earningsService: EarningsService);
    getEarningsOverview(): Promise<{
        kpis: {
            totalEarningsYTD: number;
            avgDailyRevenue: number;
            paidPercentage: number;
            pendingPercentage: number;
            activeMarkets: number;
            earningsDelta: number;
            avgDailyDelta: number;
        };
        chartData: {
            month: string;
            totalPNL: number;
        }[];
        payoutStatus: {
            clearedPayouts: number;
            scheduledPending: number;
            disputedOnHold: number;
        };
        channelBreakdown: {
            name: string;
            amount: number;
        }[];
    }>;
}
