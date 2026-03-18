import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SystemuserService } from './systemuser.service';
import { UsersService } from '../users/users.service';
import { SuperadminService } from '../superadmin/superadmin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly systemuserService: SystemuserService,
    private readonly usersService: UsersService,
    private readonly superadminService: SuperadminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-me-in-prod',
    });
  }

  async validate(payload: any) {
    const userId = payload.userId || payload.sub;
    if (!userId) {
      return null;
    }

    const role = payload.role;
    const companyId = payload.companyId;

    // Customer token (from /users/login) → validate from tbl_users only; /users/me must return user table data
    if (role === 'customer' && companyId) {
      try {
        const customer = await this.usersService.findOne(Number(userId), companyId);
        if (!customer || !customer.isActive || customer.isBanned) {
          return null;
        }
        return {
          userId: customer.id,
          companyId: customer.companyId,
          email: customer.email,
          name: (customer as any).name,
          role: customer.role ?? 'customer',
        };
      } catch {
        return null;
      }
    }

    // Super admin token (from /auth/superadmin/login) → validate from superadmin table
    if (role === 'SUPER_ADMIN') {
      try {
        const superadmin = await this.superadminService.findOne(Number(userId));
        if (!superadmin || (superadmin as any).isActive === false) {
          return null;
        }
        return {
          userId: superadmin.id,
          email: (superadmin as any).email,
          role: 'SUPER_ADMIN',
        };
      } catch {
        return null;
      }
    }

    // System user / admin token (from /auth/login) → validate from systemuser table
    try {
      const user = await this.systemuserService.findOne(Number(userId));
      if (!user || !user.isActive) {
        return null;
      }
      return {
        userId: user.id,
        companyId: user.companyId,
        email: user.email,
        permissions: user.permissions || [],
        role: user.role,
      };
    } catch {
      return null;
    }
  }
}

