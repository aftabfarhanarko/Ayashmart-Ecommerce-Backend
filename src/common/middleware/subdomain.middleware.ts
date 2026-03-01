import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemUser } from '../../systemuser/entities/systemuser.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(SystemUser)
    private readonly systemUserRepo: Repository<SystemUser>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const hostname = req.hostname?.toLowerCase();
    if (!hostname) {
      return next();
    }

    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return next();
    }

    // Skip tenant resolution for the main API domain so /users/me and other API routes work
    // (companyId comes from JWT or query, not from subdomain)
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
    } else if (parts.length === 2 && parts[1] === 'localhost') {
      subdomain = parts[0];
    }

    if (!subdomain || subdomain === 'www') {
      return next();
    }

    const cacheKey = `tenant_host:${normalizedHost}`;
    let cachedCompanyId: string | undefined;

    try {
      cachedCompanyId = await this.cacheManager.get<string>(cacheKey);
    } catch (error) {
      console.error('Cache manager error:', error);
    }

    if (cachedCompanyId) {
      req.query.companyId = cachedCompanyId;
      (req as any).companyId = cachedCompanyId;
      // console.log(`[SubdomainMiddleware] Cache hit for '${normalizedHost}' -> '${cachedCompanyId}'`);
      return next();
    }

    let tenant: (Pick<SystemUser, 'companyId' | 'subdomain' | 'customDomain' | 'customDomainStatus' | 'subdomainEnabled'>) | null = null;
    let resolvedBy: 'subdomain' | 'customDomain' | null = null;

    // 1. Try to find by subdomain if we extracted one
    if (subdomain && subdomain !== 'www') {
      try {
        tenant = await this.systemUserRepo.findOne({
          where: { subdomain },
          select: ['companyId', 'subdomain', 'customDomain', 'customDomainStatus', 'subdomainEnabled'],
        });
        if (tenant) {
          resolvedBy = 'subdomain';
        }
      } catch (e) {
        // Ignore
      }
    }

    // 2. If no tenant found by subdomain, try custom domain
    // We use the full normalized host (e.g. "myshop.com" or "shop.brand.com")
    if (!tenant) {
      try {
        tenant = await this.systemUserRepo.findOne({
          where: { customDomain: normalizedHost, customDomainStatus: 'active' },
          select: ['companyId', 'subdomain', 'customDomain', 'customDomainStatus', 'subdomainEnabled'],
        });
        if (tenant) {
          resolvedBy = 'customDomain';
        }
      } catch (e) {
        // Ignore
      }
    }

    if (tenant) {
      // Domain resolution rules:
      // 1) If request is via custom domain (verified), always allow.
      // 2) If request is via platform subdomain and it's disabled:
      //    - If a verified custom domain exists, redirect there
      //    - Otherwise, return 404
      if (resolvedBy === 'subdomain') {
        if (!tenant.subdomainEnabled) {
          // Platform subdomain disabled – prefer redirect to verified custom domain
          if (tenant.customDomain && tenant.customDomainStatus === 'active') {
            const targetUrl = `${req.protocol}://${tenant.customDomain}${req.originalUrl}`;
            return res.redirect(302, targetUrl);
          }

          // No verified custom domain to fall back to -> 404
          return res.status(404).send('Store not available');
        }
      }

      // Inject companyId into request query so controllers can pick it up
      req.query.companyId = tenant.companyId;

      // Also inject into request object for custom decorators/guards if needed
      (req as any).companyId = tenant.companyId;

      console.log(`[SubdomainMiddleware] Resolved host '${normalizedHost}' to companyId '${tenant.companyId}' via ${resolvedBy ?? 'unknown'}`);

      try {
        await this.cacheManager.set(cacheKey, tenant.companyId, 300 * 1000); // Cache for 5 minutes
      } catch (error) {
        console.error('Failed to set cache:', error);
      }
    }

    next();
  }
}
