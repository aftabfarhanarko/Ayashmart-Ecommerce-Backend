import { ConfigService } from '@nestjs/config';
export interface CloudflareHostnameResult {
    id: string;
    hostname: string;
    status: 'pending_validation' | 'active' | 'moved' | 'deleted';
    ssl?: {
        status: string;
    };
}
export declare class CloudflareCustomDomainService {
    private readonly configService;
    private readonly logger;
    private readonly client;
    private readonly accountId;
    private readonly zoneId;
    private readonly useCustomHostnames;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    addCustomHostname(hostname: string): Promise<CloudflareHostnameResult | null>;
    getCustomHostnameStatus(hostnameId: string): Promise<CloudflareHostnameResult | null>;
}
