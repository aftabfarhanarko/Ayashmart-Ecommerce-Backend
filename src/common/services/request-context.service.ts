import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

/**
 * Service to extract companyId from request context.
 * This service should be request-scoped to access the current request.
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
    constructor(@Inject(REQUEST) private readonly request: Request) { }

    getCompanyId(): string {
        const req = this.request as Request & { companyId?: string; user?: { companyId?: string } };
        const companyId = req.companyId || req.user?.companyId;
        if (!companyId) {
            throw new Error('Company ID not found in the request context.');
        }
        return companyId;
    }

    getUserId(): number {
        const req = this.request as Request & { user?: { userId?: number; sub?: number } };
        const userId = req.user?.userId || req.user?.sub;
        if (!userId) {
            throw new Error('User ID not found in the request context.');
        }
        return userId;
    }
}

