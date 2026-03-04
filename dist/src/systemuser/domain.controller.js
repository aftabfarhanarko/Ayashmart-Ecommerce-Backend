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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainController = void 0;
const common_1 = require("@nestjs/common");
const systemuser_service_1 = require("./systemuser.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const config_1 = require("@nestjs/config");
const dns_verification_service_1 = require("./dns-verification.service");
const cloudflare_custom_domain_service_1 = require("./cloudflare-custom-domain.service");
let DomainController = class DomainController {
    constructor(systemUserService, configService, dnsVerification, cloudflareService) {
        this.systemUserService = systemUserService;
        this.configService = configService;
        this.dnsVerification = dnsVerification;
        this.cloudflareService = cloudflareService;
    }
    async updateDomain(req, body) {
        const userId = req.user.userId;
        const domain = body.customDomain
            ? this.systemUserService.normalizeCustomDomain(body.customDomain)
            : '';
        const updated = await this.systemUserService.update(userId, { customDomain: domain || null });
        this.systemUserService
            .provisionCustomDomainInRailway(userId)
            .catch((err) => console.error('provisionCustomDomainInRailway:', err));
        const cnameTarget = 'console.innowavecart.app';
        return {
            success: true,
            message: 'Custom domain saved. Add the DNS records below; verification and SSL will run automatically.',
            data: {
                customDomain: updated.customDomain,
                status: updated.customDomainStatus,
                verificationRequired: {
                    cname: { host: 'www', target: cnameTarget },
                    txt: updated.customDomain
                        ? {
                            name: this.dnsVerification.getTxtRecordHost(updated.customDomain),
                            value: updated.customDomainVerificationCode,
                            fullName: `_innowavecart-verify.${updated.customDomain}`,
                        }
                        : null,
                },
            },
        };
    }
    async getDomain(req) {
        const userId = req.user.userId;
        const user = await this.systemUserService.findOne(userId);
        const cnameTarget = 'console.innowavecart.app';
        const mainDomain = 'console.innowavecart.app';
        const platformSubdomain = user.subdomain
            ? `${user.subdomain}.${mainDomain}`
            : null;
        const status = user.customDomainStatus ?? 'pending_dns';
        const needsTxt = status === 'pending_dns' || status === 'pending';
        return {
            subdomain: user.subdomain,
            subdomainEnabled: user.subdomainEnabled ?? true,
            customDomain: user.customDomain,
            customDomainStatus: status,
            customDomainVerifiedAt: user.customDomainVerifiedAt ?? null,
            platformSubdomain,
            verificationRequired: {
                type: 'CNAME',
                value: cnameTarget,
                host: '@',
                hostForWww: 'www',
                note: 'Point www (and optionally root) to our storefront. Then add the TXT record for automatic verification.',
                rootNote: 'For root domain use CNAME flattening or A/ALIAS if your DNS provider supports it.',
            },
            txtVerification: needsTxt && user.customDomain && user.customDomainVerificationCode
                ? {
                    name: this.dnsVerification.getTxtRecordHost(user.customDomain),
                    value: user.customDomainVerificationCode,
                    fullName: `_innowavecart-verify.${user.customDomain}`,
                    note: 'Add this TXT record to prove domain ownership. Verification runs automatically every few minutes.',
                }
                : null,
        };
    }
    async toggleSubdomain(req, body) {
        const userId = req.user.userId;
        const updated = await this.systemUserService.update(userId, { subdomainEnabled: body.enabled });
        return {
            success: true,
            message: 'Platform subdomain preference updated',
            data: {
                subdomain: updated.subdomain,
                subdomainEnabled: updated.subdomainEnabled,
            },
        };
    }
    async verifyDomain(req) {
        const userId = req.user.userId;
        const user = await this.systemUserService.findOne(userId);
        if (!user.customDomain) {
            throw new common_1.BadRequestException('No custom domain set');
        }
        const status = user.customDomainStatus;
        if (status === 'active') {
            return {
                success: true,
                status: 'active',
                message: 'Domain is already active.',
            };
        }
        const token = user.customDomainVerificationCode;
        if (!token) {
            throw new common_1.BadRequestException('Verification token missing; try saving the domain again.');
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
};
exports.DomainController = DomainController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DomainController.prototype, "updateDomain", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DomainController.prototype, "getDomain", null);
__decorate([
    (0, common_1.Post)('subdomain/toggle'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DomainController.prototype, "toggleSubdomain", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DomainController.prototype, "verifyDomain", null);
exports.DomainController = DomainController = __decorate([
    (0, common_1.Controller)('settings/domain'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [systemuser_service_1.SystemuserService,
        config_1.ConfigService,
        dns_verification_service_1.DnsVerificationService,
        cloudflare_custom_domain_service_1.CloudflareCustomDomainService])
], DomainController);
//# sourceMappingURL=domain.controller.js.map