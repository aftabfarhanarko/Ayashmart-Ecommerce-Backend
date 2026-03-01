import { Repository } from 'typeorm';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
export declare class EarningsService {
    private readonly systemUserRepo;
    private readonly invoiceRepo;
    constructor(systemUserRepo: Repository<SystemUser>, invoiceRepo: Repository<Invoice>);
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
