import { Repository } from 'typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { ResellerPayout } from './entities/reseller-payout.entity';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { ConfigService } from '@nestjs/config';
import { RequestPayoutDto } from './dto/request-payout.dto';
export declare class ResellerService {
    private readonly productRepo;
    private readonly payoutRepo;
    private readonly systemUserRepo;
    private readonly configService;
    private readonly mailer;
    constructor(productRepo: Repository<ProductEntity>, payoutRepo: Repository<ResellerPayout>, systemUserRepo: Repository<SystemUser>, configService: ConfigService, mailer: {
        sendMail: (message: any) => Promise<{
            id?: string;
        }>;
    });
    getSummary(resellerId: number, companyId: string): Promise<{
        totalProducts: number;
        totalSoldQty: number;
        totalEarning: number;
        commissionRate: number;
        totalCommission: number;
        resellerNetEarning: number;
        pendingPayoutAmount: number;
        totalWithdrawn: number;
    }>;
    listPayouts(resellerId: number, companyId: string): Promise<ResellerPayout[]>;
    requestPayout(resellerId: number, companyId: string, dto: RequestPayoutDto): Promise<ResellerPayout>;
    adminCreatePayout(resellerId: number, companyId: string, dto: RequestPayoutDto): Promise<ResellerPayout>;
    resellerMarkPayoutPaid(payoutId: number, resellerId: number, companyId: string): Promise<ResellerPayout>;
    adminListPayouts(companyId?: string): Promise<ResellerPayout[]>;
    markPayoutPaid(id: number): Promise<ResellerPayout>;
    getPayoutInvoice(payoutId: number, resellerId: number, companyId: string): Promise<{
        invoiceNumber: string;
        resellerName: string;
        resellerEmail: string;
        companyName: string;
        amount: number;
        paidAt: Date;
        requestedAt: Date;
        payoutId: number;
    }>;
    adminGetPayoutInvoice(payoutId: number, companyId: string): Promise<{
        invoiceNumber: string;
        resellerName: string;
        resellerEmail: string;
        companyName: string;
        amount: number;
        paidAt: Date;
        requestedAt: Date;
        payoutId: number;
    }>;
    adminResellersList(companyId?: string): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        companyId: string;
        companyName: string;
        isActive: boolean;
        createdAt: Date;
        totalProducts: number;
        totalSoldQty: number;
        totalEarning: number;
        commissionRate: number;
        totalCommission: number;
        pendingPayoutAmount: number;
        totalWithdrawn: number;
        payouts: ResellerPayout[];
    }[]>;
    approveReseller(id: number): Promise<SystemUser>;
    deleteReseller(id: number): Promise<{
        id: number;
    }>;
}
