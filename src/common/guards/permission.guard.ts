import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { FeaturePermission } from '../../systemuser/feature-permission.enum';
import { SystemUserRole } from '../../systemuser/system-user-role.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<FeaturePermission>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // GET requests only need authentication (valid token) - no role or permission check needed
    if (request.method === 'GET') {
      return true;
    }

    // SYSTEM_OWNER and SUPER_ADMIN have full access - bypass permission check for other methods
    const userRole = user.role;
    if (userRole === SystemUserRole.SYSTEM_OWNER || userRole === SystemUserRole.SUPER_ADMIN || userRole === 'SUPER_ADMIN') {
      return true;
    }

    // For other roles (EMPLOYEE or undefined), check permissions for non-GET requests
    if (!user?.permissions || !Array.isArray(user.permissions)) {
      throw new ForbiddenException('Insufficient permissions: User does not have required permissions');
    }

    if (!user.permissions.includes(requiredPermission)) {
      throw new ForbiddenException(`Insufficient permissions: Required permission '${requiredPermission}' not found`);
    }

    return true;
  }
}


