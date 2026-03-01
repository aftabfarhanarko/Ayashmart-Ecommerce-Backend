import { SystemuserService } from './systemuser.service';
import { DnsVerificationService } from './dns-verification.service';
import { CloudflareCustomDomainService } from './cloudflare-custom-domain.service';
export declare class DomainVerificationCronService {
    private readonly systemuserService;
    private readonly dnsVerification;
    private readonly cloudflareService;
    private readonly logger;
    constructor(systemuserService: SystemuserService, dnsVerification: DnsVerificationService, cloudflareService: CloudflareCustomDomainService);
    runDnsVerification(): Promise<void>;
    runSslProvisioningCheck(): Promise<void>;
}
