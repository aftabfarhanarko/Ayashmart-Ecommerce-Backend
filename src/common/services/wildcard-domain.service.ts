import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WildcardSetupResult {
  success: boolean;
  cloudflare?: { done: boolean; message: string; recordId?: string };
  railway?: { done: boolean; message: string };
  errors?: string[];
}

/**
 * Automates wildcard DNS setup for *.console.innowavecart.app (or MAIN_DOMAIN).
 * 1. Creates CNAME *.console -> RAILWAY_SERVICE_DOMAIN in Cloudflare
 * 2. Adds *.console.innowavecart.app to Railway project via GraphQL API
 *
 * Required env:
 * - CLOUDFLARE_ZONE_ID: Zone ID for innowavecart.app
 * - CLOUDFLARE_API_TOKEN: API token with Zone:DNS:Edit
 * - RAILWAY_TOKEN: Railway API token
 * - RAILWAY_PROJECT_ID: Railway project ID
 * - RAILWAY_SERVICE_DOMAIN: e.g. innowavecart-console.up.railway.app
 * - MAIN_DOMAIN: e.g. console.innowavecart.app (optional, defaults to console.innowavecart.app)
 */
@Injectable()
export class WildcardDomainService {
  private readonly logger = new Logger(WildcardDomainService.name);

  constructor(private readonly configService: ConfigService) {}

  private get zoneId(): string | null {
    return this.configService.get<string>('CLOUDFLARE_ZONE_ID') ?? null;
  }

  private get cloudflareToken(): string | null {
    return this.configService.get<string>('CLOUDFLARE_API_TOKEN') ?? null;
  }

  private get railwayToken(): string | null {
    return this.configService.get<string>('RAILWAY_TOKEN') ?? null;
  }

  private get railwayProjectId(): string | null {
    return this.configService.get<string>('RAILWAY_PROJECT_ID') ?? null;
  }

  private get railwayServiceId(): string | null {
    return this.configService.get<string>('RAILWAY_SERVICE_ID') ?? null;
  }

  private get railwayServiceDomain(): string | null {
    return (
      this.configService.get<string>('RAILWAY_SERVICE_DOMAIN') ??
      this.configService.get<string>('RAILWAY_DOMAIN') ??
      null
    );
  }

  private get mainDomain(): string {
    return this.configService.get<string>('MAIN_DOMAIN') ?? 'console.innowavecart.app';
  }

  isConfigured(): boolean {
    return Boolean(
      this.zoneId &&
        this.cloudflareToken &&
        this.railwayToken &&
        this.railwayProjectId &&
        this.railwayServiceDomain,
    );
  }

  /**
   * Ensures wildcard CNAME *.console.innowavecart.app exists in Cloudflare
   * pointing to RAILWAY_SERVICE_DOMAIN.
   */
  async ensureCloudflareWildcardDns(): Promise<{ done: boolean; message: string; recordId?: string }> {
    if (!this.zoneId || !this.cloudflareToken || !this.railwayServiceDomain) {
      return {
        done: false,
        message: 'Missing CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN, or RAILWAY_SERVICE_DOMAIN',
      };
    }

    const mainDomain = this.mainDomain; // e.g. console.innowavecart.app
    const baseName = mainDomain.split('.')[0]; // e.g. console
    const wildcardName = `*.${baseName}`; // *.console (Cloudflare uses this for *.console.innowavecart.app)
    const target = this.railwayServiceDomain;

    try {
      // Check if record already exists
      const listRes = await axios.get(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`,
        {
          headers: { Authorization: `Bearer ${this.cloudflareToken}` },
          params: { type: 'CNAME' },
        },
      );

      const records = listRes.data?.result ?? [];
      const zoneApex = mainDomain.includes('.') ? mainDomain.split('.').slice(-2).join('.') : 'innowavecart.app';
      const wildcardFqdn = `${wildcardName}.${zoneApex}`; // *.console.innowavecart.app
      const existing = Array.isArray(records)
        ? records.find((r: any) => r.name === wildcardFqdn)
        : null;

      if (existing) {
        if (existing.content === target) {
          this.logger.log(`Cloudflare wildcard DNS already exists: ${wildcardName} -> ${target}`);
          return { done: true, message: 'Wildcard CNAME already exists', recordId: existing.id };
        }
        // Update existing record
        await axios.patch(
          `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${existing.id}`,
          { type: 'CNAME', content: target, ttl: 1, proxied: false },
          { headers: { Authorization: `Bearer ${this.cloudflareToken}` } },
        );
        this.logger.log(`Cloudflare wildcard DNS updated: ${wildcardName} -> ${target}`);
        return { done: true, message: 'Wildcard CNAME updated', recordId: existing.id };
      }

      // Create new record - Cloudflare expects name relative to zone
      // For zone innowavecart.app: name "*.console" creates *.console.innowavecart.app
      const createRes = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`,
        {
          type: 'CNAME',
          name: wildcardName,
          content: target,
          ttl: 1,
          proxied: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.cloudflareToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!createRes.data?.success) {
        const errMsg = createRes.data?.errors?.[0]?.message || JSON.stringify(createRes.data);
        this.logger.error(`Cloudflare create wildcard failed: ${errMsg}`);
        return { done: false, message: errMsg };
      }

      const recordId = createRes.data?.result?.id;
      this.logger.log(`Cloudflare wildcard DNS created: ${wildcardName} -> ${target} (id: ${recordId})`);
      return { done: true, message: 'Wildcard CNAME created', recordId };
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.[0]?.message || err?.message;
      this.logger.error(`Cloudflare wildcard DNS error: ${msg}`);
      return { done: false, message: msg };
    }
  }

  /**
   * Adds *.console.innowavecart.app to Railway project so it accepts traffic and provisions SSL.
   */
  async ensureRailwayWildcardDomain(): Promise<{ done: boolean; message: string }> {
    if (!this.railwayToken || !this.railwayProjectId || !this.railwayServiceDomain) {
      return {
        done: false,
        message: 'Missing RAILWAY_TOKEN, RAILWAY_PROJECT_ID, or RAILWAY_SERVICE_DOMAIN',
      };
    }

    const wildcardDomain = `*.${this.mainDomain}`; // *.console.innowavecart.app

    try {
      const variables: Record<string, string> = {
        projectId: this.railwayProjectId,
        domain: wildcardDomain,
      };
      if (this.railwayServiceId) {
        variables.serviceId = this.railwayServiceId;
      }

      const res = await axios.post(
        'https://backboard.railway.app/graphql/v1',
        {
          query: `
            mutation AddDomain($projectId: String!, $serviceId: String, $domain: String!) {
              domainCreate(projectId: $projectId, serviceId: $serviceId, domain: $domain) {
                id
                domain
                createdAt
              }
            }
          `,
          variables,
        },
        {
          headers: {
            Authorization: `Bearer ${this.railwayToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = res.data?.data;
      const errors = res.data?.errors;

      if (errors?.length) {
        const errMsg = errors[0]?.message || JSON.stringify(errors);
        // Domain might already exist
        if (errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('exist')) {
          this.logger.log(`Railway wildcard domain already exists: ${wildcardDomain}`);
          return { done: true, message: 'Wildcard domain already in Railway' };
        }
        this.logger.error(`Railway add domain failed: ${errMsg}`);
        return { done: false, message: errMsg };
      }

      if (data?.domainCreate) {
        this.logger.log(`Railway wildcard domain added: ${wildcardDomain}`);
        return { done: true, message: 'Wildcard domain added to Railway' };
      }

      return { done: false, message: 'Railway API returned no result' };
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.[0]?.message || err?.message;
      this.logger.error(`Railway wildcard domain error: ${msg}`);
      return { done: false, message: msg };
    }
  }

  /**
   * Full setup: Cloudflare DNS + Railway domain.
   * Call on deploy or via superadmin endpoint.
   */
  async setupWildcard(): Promise<WildcardSetupResult> {
    const result: WildcardSetupResult = { success: true };
    const errors: string[] = [];

    if (!this.isConfigured()) {
      return {
        success: false,
        errors: [
          'Configure CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN, RAILWAY_TOKEN, RAILWAY_PROJECT_ID, RAILWAY_SERVICE_DOMAIN',
        ],
      };
    }

    const cf = await this.ensureCloudflareWildcardDns();
    result.cloudflare = cf;
    if (!cf.done) errors.push(`Cloudflare: ${cf.message}`);

    const rw = await this.ensureRailwayWildcardDomain();
    result.railway = rw;
    if (!rw.done) errors.push(`Railway: ${rw.message}`);

    result.success = errors.length === 0;
    if (errors.length) result.errors = errors;

    return result;
  }
}
