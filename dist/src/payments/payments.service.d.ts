import { HttpService } from '@nestjs/axios';
import { SslInitiateDto } from './dto/ssl-initiate.dto';
import { Repository } from 'typeorm';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
export declare class PaymentsService {
    private readonly http;
    private readonly systemUserRepo;
    constructor(http: HttpService, systemUserRepo: Repository<SystemUser>);
    initiateSslPayment(dto: SslInitiateDto): Promise<any>;
    validateSslPayment(valId: string): Promise<any>;
    processPaymentSuccess(valId: string, paymentData: any): Promise<{
        success: boolean;
        userId: number;
        companyId: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        userId?: undefined;
        companyId?: undefined;
    }>;
    createCashOnDelivery(orderId: string, amount: number, address: string): Promise<{
        orderId: string;
        amount: number;
        address: string;
        paymentMethod: string;
        status: string;
        message: string;
    }>;
}
