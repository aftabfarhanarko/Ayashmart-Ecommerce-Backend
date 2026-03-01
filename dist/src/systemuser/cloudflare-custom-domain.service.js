"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CloudflareCustomDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareCustomDomainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let CloudflareCustomDomainService = CloudflareCustomDomainService_1 = class CloudflareCustomDomainService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CloudflareCustomDomainService_1.name);
        const token = 'ab8b3e2226d54cf643764eb6713a7f4d5e592';
        this.accountId =
            'ecb5f1a1ea76c55fbd0f4a96b08cf6cf';
        this.zoneId =
            '2c7c6690542308071e74be6b8e7fb632';
        this.useCustomHostnames = Boolean(this.accountId && token);
        if (this.useCustomHostnames) {
            this.client = axios_1.default.create({
                baseURL: 'https://api.cloudflare.com/client/v4',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        else {
            this.client = null;
            this.logger.log('Cloudflare Custom Hostnames not configured (set CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN to enable automatic SSL)');
        }
    }
    isConfigured() {
        return this.useCustomHostnames && Boolean(this.client);
    }
    async addCustomHostname(hostname) {
        if (!this.client || !this.accountId) {
            return null;
        }
        const hostnameNorm = hostname.toLowerCase().replace(/^www\./, '').trim();
        try {
            const { data } = await this.client.post(`/accounts/${this.accountId}/custom_hostnames`, {
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
                this.logger.warn(`Cloudflare addCustomHostname failed: ${JSON.stringify(data.errors || data)}`);
                return null;
            }
            this.logger.log(`Cloudflare custom hostname added: ${hostnameNorm} -> ${data.result.id}`);
            return data.result;
        }
        catch (err) {
            this.logger.error(`Cloudflare addCustomHostname error for ${hostnameNorm}: ${err?.response?.data?.errors?.[0]?.message || err?.message}`);
            return null;
        }
    }
    async getCustomHostnameStatus(hostnameId) {
        if (!this.client || !this.accountId) {
            return null;
        }
        try {
            const { data } = await this.client.get(`/accounts/${this.accountId}/custom_hostnames/${hostnameId}`);
            if (!data.success || !data.result) {
                return null;
            }
            return data.result;
        }
        catch (err) {
            this.logger.warn(`Cloudflare getCustomHostnameStatus error: ${err?.message}`);
            return null;
        }
    }
};
exports.CloudflareCustomDomainService = CloudflareCustomDomainService;
exports.CloudflareCustomDomainService = CloudflareCustomDomainService = CloudflareCustomDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudflareCustomDomainService);
//# sourceMappingURL=cloudflare-custom-domain.service.js.map