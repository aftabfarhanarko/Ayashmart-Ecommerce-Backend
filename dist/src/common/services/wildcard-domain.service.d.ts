import { ConfigService } from '@nestjs/config';
export interface WildcardSetupResult {
    success: boolean;
    cloudflare?: {
        done: boolean;
        message: string;
        recordId?: string;
    };
    railway?: {
        done: boolean;
        message: string;
    };
    errors?: string[];
}
export declare class WildcardDomainService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private get zoneId();
    private get cloudflareToken();
    private get railwayToken();
    private get railwayProjectId();
    private get railwayServiceId();
    private get railwayServiceDomain();
    private get mainDomain();
    isConfigured(): boolean;
    ensureCloudflareWildcardDns(): Promise<{
        done: boolean;
        message: string;
        recordId?: string;
    }>;
    ensureRailwayWildcardDomain(): Promise<{
        done: boolean;
        message: string;
    }>;
    setupWildcard(): Promise<WildcardSetupResult>;
}
