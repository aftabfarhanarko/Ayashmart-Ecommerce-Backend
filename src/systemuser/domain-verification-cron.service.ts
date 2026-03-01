import { Injectable, Logger } from '@nestjs/common';
import { SystemuserService } from './systemuser.service';
import { DnsVerificationService } from './dns-verification.service';
import { CloudflareCustomDomainService } from './cloudflare-custom-domain.service';
import { Cron } from '@nestjs/schedule';

/**
 * Periodic jobs for fully automatic custom domain flow:
 * 1. pending_dns -> verify TXT -> verified -> (Cloudflare) -> ssl_provisioning
 * 2. ssl_provisioning -> poll Cloudflare -> active
 */
@Injectable()
export class DomainVerificationCronService {
  private readonly logger = new Logger(DomainVerificationCronService.name);

  constructor(
    private readonly systemuserService: SystemuserService,
    private readonly dnsVerification: DnsVerificationService,
    private readonly cloudflareService: CloudflareCustomDomainService,
  ) {}

  @Cron('*/5 * * * *')
  async runDnsVerification() {
    const users = await this.systemuserService.findPendingDnsDomains();
    for (const user of users) {
      const domain = (user as any).customDomain;
      const token = (user as any).customDomainVerificationCode;
      if (!domain || !token) continue;
      try {
        const ok = await this.dnsVerification.verifyTxtOwnership(domain, token);
        if (!ok) continue;

        await this.systemuserService.setCustomDomainVerified(user.id);

        if (this.cloudflareService.isConfigured()) {
          const result = await this.cloudflareService.addCustomHostname(domain);
          await this.systemuserService.setCustomDomainSslProvisioning(
            user.id,
            result?.id ?? null,
          );
          if (result?.id) {
            await this.systemuserService.setCloudflareHostnameId(user.id, result.id);
          }
        } else {
          await this.systemuserService.setCustomDomainActive(user.id);
        }
        this.logger.log(`Domain verified and progressing: ${domain} (userId: ${user.id})`);
      } catch (err: any) {
        this.logger.warn(`DNS verification failed for ${domain}: ${err?.message}`);
      }
    }
  }

  @Cron('*/5 * * * *')
  async runSslProvisioningCheck() {
    const users = await this.systemuserService.findSslProvisioningDomains();
    for (const user of users) {
      const hostnameId = (user as any).cloudflareHostnameId;
      if (!hostnameId) {
        await this.systemuserService.setCustomDomainActive(user.id);
        continue;
      }
      try {
        const result = await this.cloudflareService.getCustomHostnameStatus(hostnameId);
        if (result?.status === 'active') {
          await this.systemuserService.setCustomDomainActive(user.id);
          this.logger.log(`Custom domain SSL active: ${(user as any).customDomain} (userId: ${user.id})`);
        }
      } catch (err: any) {
        this.logger.warn(`SSL status check failed for user ${user.id}: ${err?.message}`);
      }
    }
  }
}
