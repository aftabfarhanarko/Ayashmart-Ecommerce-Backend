import { ConfigService } from '@nestjs/config';
export declare class VoiceService {
    private configService;
    private client;
    private readonly logger;
    constructor(configService: ConfigService);
    makeOrderConfirmationCall(customerPhone: string, orderId: number, companyId: string): Promise<string>;
}
