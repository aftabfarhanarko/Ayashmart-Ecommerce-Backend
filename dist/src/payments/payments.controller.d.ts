import { HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SslInitiateDto } from './dto/ssl-initiate.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initiateSsl(dto: SslInitiateDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
    sslCallback(query: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
    cashOnDelivery(body: {
        orderId: string;
        amount: number;
        address: string;
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            orderId: string;
            amount: number;
            address: string;
            paymentMethod: string;
            status: string;
            message: string;
        };
    }>;
}
