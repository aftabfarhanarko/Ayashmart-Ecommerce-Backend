import { SystemuserService } from './systemuser.service';
import { ConfigService } from '@nestjs/config';
import { DnsVerificationService } from './dns-verification.service';
import { CloudflareCustomDomainService } from './cloudflare-custom-domain.service';
export declare class DomainController {
    private readonly systemUserService;
    private readonly configService;
    private readonly dnsVerification;
    private readonly cloudflareService;
    constructor(systemUserService: SystemuserService, configService: ConfigService, dnsVerification: DnsVerificationService, cloudflareService: CloudflareCustomDomainService);
    updateDomain(req: any, body: {
        customDomain: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            customDomain: any;
            status: any;
            verificationRequired: {
                cname: {
                    host: string;
                    target: string;
                };
                txt: {
                    name: string;
                    value: any;
                    fullName: string;
                };
            };
        };
    }>;
    getDomain(req: any): Promise<{
        subdomain: any;
        subdomainEnabled: any;
        customDomain: any;
        customDomainStatus: any;
        customDomainVerifiedAt: any;
        platformSubdomain: string;
        verificationRequired: {
            type: string;
            value: string;
            host: string;
            hostForWww: string;
            note: string;
            rootNote: string;
        };
        txtVerification: {
            name: string;
            value: any;
            fullName: string;
            note: string;
        };
    }>;
    toggleSubdomain(req: any, body: {
        enabled: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            subdomain: any;
            subdomainEnabled: any;
        };
    }>;
    verifyDomain(req: any): Promise<{
        success: boolean;
        status: any;
        message: string;
    }>;
}
