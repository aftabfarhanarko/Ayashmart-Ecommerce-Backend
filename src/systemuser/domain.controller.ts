import { Controller, Post, Body, Get, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { SystemuserService } from './systemuser.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { DnsVerificationService } from './dns-verification.service';
import { CloudflareCustomDomainService } from './cloudflare-custom-domain.service';

@Controller('settings/domain')
@UseGuards(JwtAuthGuard)
export class DomainController {
  constructor(
    private readonly systemUserService: SystemuserService,
    private readonly configService: ConfigService,
    private readonly dnsVerification: DnsVerificationService,
    private readonly cloudflareService: CloudflareCustomDomainService,
  ) {}

  @Post()
  async updateDomain(@Request() req, @Body() body: { customDomain: string }) {
    const userId = req.user.userId;
    const domain = body.customDomain
      ? this.systemUserService.normalizeCustomDomain(body.customDomain)
      : '';

    const updated = await this.systemUserService.update(userId, { customDomain: domain || null } as any);

    this.systemUserService
      .provisionCustomDomainInRailway(userId)
      .catch((err) => console.error('provisionCustomDomainInRailway:', err));

    const cnameTarget = 'console.innowavecart.app';

    return {
      success: true,
      message: 'Custom domain saved. Add the DNS records below; verification and SSL will run automatically.',
      data: {
        customDomain: updated.customDomain,
        status: (updated as any).customDomainStatus,
        verificationRequired: {
          cname: { host: 'www', target: cnameTarget },
          txt: updated.customDomain
            ? {
                name: this.dnsVerification.getTxtRecordHost(updated.customDomain),
                value: (updated as any).customDomainVerificationCode,
                fullName: `_innowavecart-verify.${updated.customDomain}`,
              }
            : null,
        },
      },
    };
  }

  @Get()
  async getDomain(@Request() req) {
    const userId = req.user.userId;
    const user = await this.systemUserService.findOne(userId);

    const cnameTarget = 'console.innowavecart.app';

    const mainDomain = 'console.innowavecart.app';

    const platformSubdomain = user.subdomain
      ? `${user.subdomain}.${mainDomain}`
      : null;

    const status = (user as any).customDomainStatus ?? 'pending_dns';
    const needsTxt = status === 'pending_dns' || status === 'pending';

    return {
      subdomain: user.subdomain,
      subdomainEnabled: (user as any).subdomainEnabled ?? true,
      customDomain: user.customDomain,
      customDomainStatus: status,
      customDomainVerifiedAt: (user as any).customDomainVerifiedAt ?? null,
      platformSubdomain,
      verificationRequired: {
        type: 'CNAME',
        value: cnameTarget,
        host: '@',
        hostForWww: 'www',
        note: 'Point www (and optionally root) to our storefront. Then add the TXT record for automatic verification.',
        rootNote: 'For root domain use CNAME flattening or A/ALIAS if your DNS provider supports it.',
      },
      txtVerification:
        needsTxt && user.customDomain && (user as any).customDomainVerificationCode
          ? {
              name: this.dnsVerification.getTxtRecordHost(user.customDomain),
              value: (user as any).customDomainVerificationCode,
              fullName: `_innowavecart-verify.${user.customDomain}`,
              note: 'Add this TXT record to prove domain ownership. Verification runs automatically every few minutes.',
            }
          : null,
    };
  }

  @Post('subdomain/toggle')
  async toggleSubdomain(
    @Request() req,
    @Body() body: { enabled: boolean },
  ) {
    const userId = req.user.userId;
    const updated = await this.systemUserService.update(
      userId,
      { subdomainEnabled: body.enabled } as any,
    ) as any;

    return {
      success: true,
      message: 'Platform subdomain preference updated',
      data: {
        subdomain: updated.subdomain,
        subdomainEnabled: updated.subdomainEnabled,
      },
    };
  }

  /**
   * Optional "Check now" – runs TXT verification once and, if successful,
   * moves domain to verified / ssl_provisioning / active (same logic as cron).
   */
  @Post('verify')
  async verifyDomain(@Request() req) {
    const userId = req.user.userId;
    const user = await this.systemUserService.findOne(userId);

    if (!user.customDomain) {
      throw new BadRequestException('No custom domain set');
    }

    const status = (user as any).customDomainStatus;
    if (status === 'active') {
      return {
        success: true,
        status: 'active',
        message: 'Domain is already active.',
      };
    }

    const token = (user as any).customDomainVerificationCode;
    if (!token) {
      throw new BadRequestException('Verification token missing; try saving the domain again.');
    }

    const domain = user.customDomain;
    const verified = await this.dnsVerification.verifyTxtOwnership(domain, token);

    if (!verified) {
      return {
        success: false,
        status: status || 'pending_dns',
        message: 'TXT record not found or value does not match. Add the TXT record and try again, or wait for automatic verification.',
      };
    }

    await this.systemUserService.setCustomDomainVerified(userId);

    if (this.cloudflareService.isConfigured()) {
      const result = await this.cloudflareService.addCustomHostname(domain);
      await this.systemUserService.setCustomDomainSslProvisioning(userId, result?.id ?? null);
      if (result?.id) {
        await this.systemUserService.setCloudflareHostnameId(userId, result.id);
      }
      return {
        success: true,
        status: 'ssl_provisioning',
        message: 'Domain verified. SSL is being provisioned; the domain will become active shortly.',
      };
    }

    await this.systemUserService.setCustomDomainActive(userId);
    return {
      success: true,
      status: 'active',
      message: 'Domain verified and activated.',
    };
  }
}
