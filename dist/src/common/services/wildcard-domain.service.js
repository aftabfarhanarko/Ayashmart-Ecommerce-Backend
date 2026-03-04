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
var WildcardDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildcardDomainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let WildcardDomainService = WildcardDomainService_1 = class WildcardDomainService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WildcardDomainService_1.name);
    }
    get zoneId() {
        return this.configService.get('CLOUDFLARE_ZONE_ID') ?? null;
    }
    get cloudflareToken() {
        return this.configService.get('CLOUDFLARE_API_TOKEN') ?? null;
    }
    get railwayToken() {
        return this.configService.get('RAILWAY_TOKEN') ?? null;
    }
    get railwayProjectId() {
        return this.configService.get('RAILWAY_PROJECT_ID') ?? null;
    }
    get railwayServiceId() {
        return this.configService.get('RAILWAY_SERVICE_ID') ?? null;
    }
    get railwayServiceDomain() {
        return (this.configService.get('RAILWAY_SERVICE_DOMAIN') ??
            this.configService.get('RAILWAY_DOMAIN') ??
            null);
    }
    get mainDomain() {
        return this.configService.get('MAIN_DOMAIN') ?? 'console.innowavecart.app';
    }
    isConfigured() {
        return Boolean(this.zoneId &&
            this.cloudflareToken &&
            this.railwayToken &&
            this.railwayProjectId &&
            this.railwayServiceDomain);
    }
    async ensureCloudflareWildcardDns() {
        if (!this.zoneId || !this.cloudflareToken || !this.railwayServiceDomain) {
            return {
                done: false,
                message: 'Missing CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN, or RAILWAY_SERVICE_DOMAIN',
            };
        }
        const mainDomain = this.mainDomain;
        const baseName = mainDomain.split('.')[0];
        const wildcardName = `*.${baseName}`;
        const target = this.railwayServiceDomain;
        try {
            const listRes = await axios_1.default.get(`https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`, {
                headers: { Authorization: `Bearer ${this.cloudflareToken}` },
                params: { type: 'CNAME' },
            });
            const records = listRes.data?.result ?? [];
            const zoneApex = mainDomain.includes('.') ? mainDomain.split('.').slice(-2).join('.') : 'innowavecart.app';
            const wildcardFqdn = `${wildcardName}.${zoneApex}`;
            const existing = Array.isArray(records)
                ? records.find((r) => r.name === wildcardFqdn)
                : null;
            if (existing) {
                if (existing.content === target) {
                    this.logger.log(`Cloudflare wildcard DNS already exists: ${wildcardName} -> ${target}`);
                    return { done: true, message: 'Wildcard CNAME already exists', recordId: existing.id };
                }
                await axios_1.default.patch(`https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${existing.id}`, { type: 'CNAME', content: target, ttl: 1, proxied: false }, { headers: { Authorization: `Bearer ${this.cloudflareToken}` } });
                this.logger.log(`Cloudflare wildcard DNS updated: ${wildcardName} -> ${target}`);
                return { done: true, message: 'Wildcard CNAME updated', recordId: existing.id };
            }
            const createRes = await axios_1.default.post(`https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`, {
                type: 'CNAME',
                name: wildcardName,
                content: target,
                ttl: 1,
                proxied: false,
            }, {
                headers: {
                    Authorization: `Bearer ${this.cloudflareToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!createRes.data?.success) {
                const errMsg = createRes.data?.errors?.[0]?.message || JSON.stringify(createRes.data);
                this.logger.error(`Cloudflare create wildcard failed: ${errMsg}`);
                return { done: false, message: errMsg };
            }
            const recordId = createRes.data?.result?.id;
            this.logger.log(`Cloudflare wildcard DNS created: ${wildcardName} -> ${target} (id: ${recordId})`);
            return { done: true, message: 'Wildcard CNAME created', recordId };
        }
        catch (err) {
            const msg = err?.response?.data?.errors?.[0]?.message || err?.message;
            this.logger.error(`Cloudflare wildcard DNS error: ${msg}`);
            return { done: false, message: msg };
        }
    }
    async ensureRailwayWildcardDomain() {
        if (!this.railwayToken || !this.railwayProjectId || !this.railwayServiceDomain) {
            return {
                done: false,
                message: 'Missing RAILWAY_TOKEN, RAILWAY_PROJECT_ID, or RAILWAY_SERVICE_DOMAIN',
            };
        }
        const wildcardDomain = `*.${this.mainDomain}`;
        try {
            const variables = {
                projectId: this.railwayProjectId,
                domain: wildcardDomain,
            };
            if (this.railwayServiceId) {
                variables.serviceId = this.railwayServiceId;
            }
            const res = await axios_1.default.post('https://backboard.railway.app/graphql/v1', {
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
            }, {
                headers: {
                    Authorization: `Bearer ${this.railwayToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = res.data?.data;
            const errors = res.data?.errors;
            if (errors?.length) {
                const errMsg = errors[0]?.message || JSON.stringify(errors);
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
        }
        catch (err) {
            const msg = err?.response?.data?.errors?.[0]?.message || err?.message;
            this.logger.error(`Railway wildcard domain error: ${msg}`);
            return { done: false, message: msg };
        }
    }
    async setupWildcard() {
        const result = { success: true };
        const errors = [];
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
        if (!cf.done)
            errors.push(`Cloudflare: ${cf.message}`);
        const rw = await this.ensureRailwayWildcardDomain();
        result.railway = rw;
        if (!rw.done)
            errors.push(`Railway: ${rw.message}`);
        result.success = errors.length === 0;
        if (errors.length)
            result.errors = errors;
        return result;
    }
};
exports.WildcardDomainService = WildcardDomainService;
exports.WildcardDomainService = WildcardDomainService = WildcardDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WildcardDomainService);
//# sourceMappingURL=wildcard-domain.service.js.map