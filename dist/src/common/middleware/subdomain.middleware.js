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
exports.SubdomainMiddleware = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const systemuser_entity_1 = require("../../systemuser/entities/systemuser.entity");
const cache_manager_1 = require("@nestjs/cache-manager");
let SubdomainMiddleware = class SubdomainMiddleware {
    constructor(systemUserRepo, cacheManager) {
        this.systemUserRepo = systemUserRepo;
        this.cacheManager = cacheManager;
    }
    async use(req, res, next) {
        const hostname = req.hostname?.toLowerCase();
        if (!hostname) {
            return next();
        }
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
            return next();
        }
        const defaultApiHost = (process.env.DEFAULT_API_HOST || process.env.API_DOMAIN || 'e-api-omega.vercel.app').toLowerCase();
        const normalizedHostForCompare = hostname.startsWith('www.') ? hostname.slice(4) : hostname;
        if (normalizedHostForCompare === defaultApiHost) {
            return next();
        }
        const normalizedHost = hostname.startsWith('www.') ? hostname.slice(4) : hostname;
        const parts = normalizedHost.split('.');
        let subdomain = '';
        if (parts.length >= 3) {
            subdomain = parts[0];
        }
        else if (parts.length === 2 && parts[1] === 'localhost') {
            subdomain = parts[0];
        }
        if (!subdomain || subdomain === 'www') {
            return next();
        }
        const cacheKey = `tenant_host:${normalizedHost}`;
        let cachedCompanyId;
        try {
            cachedCompanyId = await this.cacheManager.get(cacheKey);
        }
        catch (error) {
            console.error('Cache manager error:', error);
        }
        if (cachedCompanyId) {
            req.query.companyId = cachedCompanyId;
            req.companyId = cachedCompanyId;
            return next();
        }
        let tenant = null;
        let resolvedBy = null;
        if (subdomain && subdomain !== 'www') {
            try {
                tenant = await this.systemUserRepo.findOne({
                    where: { subdomain },
                    select: ['companyId', 'subdomain', 'customDomain', 'customDomainStatus', 'subdomainEnabled'],
                });
                if (tenant) {
                    resolvedBy = 'subdomain';
                }
            }
            catch (e) {
            }
        }
        if (!tenant) {
            try {
                tenant = await this.systemUserRepo.findOne({
                    where: { customDomain: normalizedHost, customDomainStatus: 'active' },
                    select: ['companyId', 'subdomain', 'customDomain', 'customDomainStatus', 'subdomainEnabled'],
                });
                if (tenant) {
                    resolvedBy = 'customDomain';
                }
            }
            catch (e) {
            }
        }
        if (tenant) {
            if (resolvedBy === 'subdomain') {
                if (!tenant.subdomainEnabled) {
                    if (tenant.customDomain && tenant.customDomainStatus === 'active') {
                        const targetUrl = `${req.protocol}://${tenant.customDomain}${req.originalUrl}`;
                        return res.redirect(302, targetUrl);
                    }
                    return res.status(404).send('Store not available');
                }
            }
            req.query.companyId = tenant.companyId;
            req.companyId = tenant.companyId;
            console.log(`[SubdomainMiddleware] Resolved host '${normalizedHost}' to companyId '${tenant.companyId}' via ${resolvedBy ?? 'unknown'}`);
            try {
                await this.cacheManager.set(cacheKey, tenant.companyId, 300 * 1000);
            }
            catch (error) {
                console.error('Failed to set cache:', error);
            }
        }
        next();
    }
};
exports.SubdomainMiddleware = SubdomainMiddleware;
exports.SubdomainMiddleware = SubdomainMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(systemuser_entity_1.SystemUser)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], SubdomainMiddleware);
//# sourceMappingURL=subdomain.middleware.js.map