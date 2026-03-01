import { Injectable } from '@nestjs/common';
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

@Injectable()
export class DeliveryConfigService {
  constructor(private configService: ConfigService) {}

  get pathao(): PathaoConfig {
    return {
      clientId: this.configService.get<string>('PATHAO_CLIENT_ID') || '',
      clientSecret: this.configService.get<string>('PATHAO_CLIENT_SECRET') || '',
      baseUrl: this.configService.get<string>('PATHAO_BASE_URL') || 'https://api.pathao.com/v1',
      grantType: this.configService.get<string>('PATHAO_GRANT_TYPE') || 'client_credentials',
    };
  }

  get steadfast(): SteadfastConfig {
    return {
      apiKey: this.configService.get<string>('STEADFAST_API_KEY') || '',
      secretKey: this.configService.get<string>('STEADFAST_SECRET_KEY') || '',
      baseUrl: this.configService.get<string>('STEADFAST_BASE_URL') || 'https://portal.steadfast.com.bd/api/v1',
    };
  }

  get redx(): RedXConfig {
    const sandbox = this.configService.get<string>('REDX_SANDBOX') !== 'false';
    return {
      token: this.configService.get<string>('REDX_TOKEN') || '',
      baseUrl: sandbox
        ? 'https://sandbox.redx.com.bd/v1.0.0-beta'
        : this.configService.get<string>('REDX_BASE_URL') || 'https://openapi.redx.com.bd/v1.0.0-beta',
      sandbox,
    };
  }

  isPathaoConfigured(): boolean {
    const config = this.pathao;
    return !!config.clientId && !!config.clientSecret;
  }

  isSteadfastConfigured(): boolean {
    const config = this.steadfast;
    return !!config.apiKey && !!config.secretKey;
  }

  isRedXConfigured(): boolean {
    const config = this.redx;
    return !!config.token;
  }
}
