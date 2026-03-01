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
var DomainVerificationCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainVerificationCronService = void 0;
const common_1 = require("@nestjs/common");
const systemuser_service_1 = require("./systemuser.service");
const dns_verification_service_1 = require("./dns-verification.service");
const cloudflare_custom_domain_service_1 = require("./cloudflare-custom-domain.service");
const schedule_1 = require("@nestjs/schedule");
let DomainVerificationCronService = DomainVerificationCronService_1 = class DomainVerificationCronService {
    constructor(systemuserService, dnsVerification, cloudflareService) {
        this.systemuserService = systemuserService;
        this.dnsVerification = dnsVerification;
        this.cloudflareService = cloudflareService;
        this.logger = new common_1.Logger(DomainVerificationCronService_1.name);
    }
    async runDnsVerification() {
        const users = await this.systemuserService.findPendingDnsDomains();
        for (const user of users) {
            const domain = user.customDomain;
            const token = user.customDomainVerificationCode;
            if (!domain || !token)
                continue;
            try {
                const ok = await this.dnsVerification.verifyTxtOwnership(domain, token);
                if (!ok)
                    continue;
                await this.systemuserService.setCustomDomainVerified(user.id);
                if (this.cloudflareService.isConfigured()) {
                    const result = await this.cloudflareService.addCustomHostname(domain);
                    await this.systemuserService.setCustomDomainSslProvisioning(user.id, result?.id ?? null);
                    if (result?.id) {
                        await this.systemuserService.setCloudflareHostnameId(user.id, result.id);
                    }
                }
                else {
                    await this.systemuserService.setCustomDomainActive(user.id);
                }
                this.logger.log(`Domain verified and progressing: ${domain} (userId: ${user.id})`);
            }
            catch (err) {
                this.logger.warn(`DNS verification failed for ${domain}: ${err?.message}`);
            }
        }
    }
    async runSslProvisioningCheck() {
        const users = await this.systemuserService.findSslProvisioningDomains();
        for (const user of users) {
            const hostnameId = user.cloudflareHostnameId;
            if (!hostnameId) {
                await this.systemuserService.setCustomDomainActive(user.id);
                continue;
            }
            try {
                const result = await this.cloudflareService.getCustomHostnameStatus(hostnameId);
                if (result?.status === 'active') {
                    await this.systemuserService.setCustomDomainActive(user.id);
                    this.logger.log(`Custom domain SSL active: ${user.customDomain} (userId: ${user.id})`);
                }
            }
            catch (err) {
                this.logger.warn(`SSL status check failed for user ${user.id}: ${err?.message}`);
            }
        }
    }
};
exports.DomainVerificationCronService = DomainVerificationCronService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DomainVerificationCronService.prototype, "runDnsVerification", null);
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DomainVerificationCronService.prototype, "runSslProvisioningCheck", null);
exports.DomainVerificationCronService = DomainVerificationCronService = DomainVerificationCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [systemuser_service_1.SystemuserService,
        dns_verification_service_1.DnsVerificationService,
        cloudflare_custom_domain_service_1.CloudflareCustomDomainService])
], DomainVerificationCronService);
//# sourceMappingURL=domain-verification-cron.service.js.map