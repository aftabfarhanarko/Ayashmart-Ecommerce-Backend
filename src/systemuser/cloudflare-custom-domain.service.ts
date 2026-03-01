import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Cloudflare SSL for SaaS (Custom Hostnames) or Universal SSL.
 * Use Custom Hostnames API when your platform is behind Cloudflare and
 * tenants bring their own domains: you add each tenant domain as a custom hostname
 * and Cloudflare issues a certificate for it.
 *
 * Env: CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN (or CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL)
 * For Custom Hostnames (recommended for multi-tenant): CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN
 */
export interface CloudflareHostnameResult {
  id: string;
  hostname: string;
  status: 'pending_validation' | 'active' | 'moved' | 'deleted';
  ssl?: { status: string };
}

@Injectable()
export class CloudflareCustomDomainService {
  private readonly logger = new Logger(CloudflareCustomDomainService.name);
  private readonly client: AxiosInstance | null;
  private readonly accountId: string | null;
  private readonly zoneId: string | null;
  private readonly useCustomHostnames: boolean;

  constructor(private readonly configService: ConfigService) {
    const token =
    'ab8b3e2226d54cf643764eb6713a7f4d5e592';

    this.accountId =
      'ecb5f1a1ea76c55fbd0f4a96b08cf6cf';
    this.zoneId =
      '2c7c6690542308071e74be6b8e7fb632';

    this.useCustomHostnames = Boolean(this.accountId && token);

    if (this.useCustomHostnames) {
      this.client = axios.create({
        baseURL: 'https://api.cloudflare.com/client/v4',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      this.client = null;
      this.logger.log(
        'Cloudflare Custom Hostnames not configured (set CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN to enable automatic SSL)',
      );
    }
  }

  isConfigured(): boolean {
    return this.useCustomHostnames && Boolean(this.client);
  }

  /**
   * Add a custom hostname (tenant domain) for SSL for SaaS.
   * CNAME for the domain must point to your fallback origin (e.g. shops.myplatform.com).
   */
  async addCustomHostname(hostname: string): Promise<CloudflareHostnameResult | null> {
    if (!this.client || !this.accountId) {
      return null;
    }
    const hostnameNorm = hostname.toLowerCase().replace(/^www\./, '').trim();
    try {
      const { data } = await this.client.post<{
        success: boolean;
        result?: CloudflareHostnameResult;
        errors?: { message: string }[];
      }>(`/accounts/${this.accountId}/custom_hostnames`, {
        hostname: hostnameNorm,
        ssl: {
          method: 'http',
          type: 'dv',
          settings: {
            min_tls_version: '1.2',
            ciphers: ['ECDHE-RSA-AES128-GCM-SHA256', 'AES128-GCM-SHA256'],
          },
        },
      });
      if (!data.success || !data.result) {
        this.logger.warn(
          `Cloudflare addCustomHostname failed: ${JSON.stringify(data.errors || data)}`,
        );
        return null;
      }
      this.logger.log(`Cloudflare custom hostname added: ${hostnameNorm} -> ${data.result.id}`);
      return data.result;
    } catch (err: any) {
      this.logger.error(
        `Cloudflare addCustomHostname error for ${hostnameNorm}: ${err?.response?.data?.errors?.[0]?.message || err?.message}`,
      );
      return null;
    }
  }

  /**
   * Get status of a custom hostname (SSL issuance progress).
   */
  async getCustomHostnameStatus(hostnameId: string): Promise<CloudflareHostnameResult | null> {
    if (!this.client || !this.accountId) {
      return null;
    }
    try {
      const { data } = await this.client.get<{
        success: boolean;
        result?: CloudflareHostnameResult;
      }>(`/accounts/${this.accountId}/custom_hostnames/${hostnameId}`);
      if (!data.success || !data.result) {
        return null;
      }
      return data.result;
    } catch (err: any) {
      this.logger.warn(`Cloudflare getCustomHostnameStatus error: ${err?.message}`);
      return null;
    }
  }
}
