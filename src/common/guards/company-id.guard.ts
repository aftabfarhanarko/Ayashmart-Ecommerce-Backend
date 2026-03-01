import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/** Superadmin role can access resources without companyId (see all companies). */
const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';

/**
 * Guard that extracts companyId from JWT and injects it into the request object.
 * This ensures that req.companyId is available for all subsequent service calls.
 * Superadmin (SUPER_ADMIN role) is allowed without companyId; req.companyId will be undefined.
 */
@Injectable()
export class CompanyIdGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        const isSuperAdmin = user.role === SUPER_ADMIN_ROLE;
        if (!isSuperAdmin && !user.companyId) {
            throw new UnauthorizedException('CompanyId not found in token');
        }

        // Superadmin: no companyId; others: inject companyId
        request.companyId = isSuperAdmin ? undefined : user.companyId;

        return true;
    }
}

