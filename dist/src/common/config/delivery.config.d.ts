import { ConfigService } from '@nestjs/config';
export interface PathaoConfig {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    grantType: string;
}
export interface SteadfastConfig {
    apiKey: string;
    secretKey: string;
    baseUrl: string;
}
export interface RedXConfig {
    token: string;
    baseUrl: string;
    sandbox: boolean;
}
export declare class DeliveryConfigService {
    private configService;
    constructor(configService: ConfigService);
    get pathao(): PathaoConfig;
    get steadfast(): SteadfastConfig;
    get redx(): RedXConfig;
    isPathaoConfigured(): boolean;
    isSteadfastConfigured(): boolean;
    isRedXConfigured(): boolean;
}
