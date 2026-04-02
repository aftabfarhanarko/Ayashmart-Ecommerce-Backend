import { HttpStatus } from '@nestjs/common';
import { ResellerService } from './reseller.service';
import { RequestPayoutDto } from './dto/request-payout.dto';
export declare class ResellerController {
    private readonly resellerService;
    constructor(resellerService: ResellerService);
    getSummary(companyId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        data: {
            totalProducts: number;
            totalSoldQty: number;
            totalEarning: number;
            commissionRate: number;
            totalCommission: number;
            resellerNetEarning: number;
            pendingPayoutAmount: number;
            totalWithdrawn: number;
        };
        message?: undefined;
    }>;
    listPayouts(companyId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        data: import("./entities/reseller-payout.entity").ResellerPayout[];
        message?: undefined;
    }>;
    getPayoutInvoice(id: number, companyId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        data: {
            invoiceNumber: string;
            resellerName: string;
            resellerEmail: string;
            companyName: string;
            amount: number;
            paidAt: Date;
            requestedAt: Date;
            payoutId: number;
        };
        message?: undefined;
    }>;
    requestPayout(companyId: string, req: any, body: RequestPayoutDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/reseller-payout.entity").ResellerPayout;
    }>;
    adminResellersList(companyId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        data: {
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
            payouts: import("./entities/reseller-payout.entity").ResellerPayout[];
        }[];
        message?: undefined;
    }>;
    adminListPayouts(companyId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        data: import("./entities/reseller-payout.entity").ResellerPayout[];
        message?: undefined;
    }>;
    adminGetPayoutInvoice(id: number, companyId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        data: {
            invoiceNumber: string;
            resellerName: string;
            resellerEmail: string;
            companyName: string;
            amount: number;
            paidAt: Date;
            requestedAt: Date;
            payoutId: number;
        };
        message?: undefined;
    }>;
    markPayoutPaid(id: number, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/reseller-payout.entity").ResellerPayout;
    }>;
    approveReseller(id: number, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: import("../systemuser/entities/systemuser.entity").SystemUser;
    }>;
    deleteReseller(id: number, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: {
            id: number;
        };
    }>;
}
