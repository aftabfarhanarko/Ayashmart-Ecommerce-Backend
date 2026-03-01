import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from './entities/systemuser.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { Theme } from '../theme/entities/theme.entity';
import { Package } from '../package/entities/package.entity';
import { SystemuserController } from './systemuser.controller';
import { AuthController } from './auth.controller';
import { SystemuserService } from './systemuser.service';
import { ActivityLogService } from './activity-log.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { CompanyIdService } from '../common/services/company-id.service';
import { SuperadminModule } from '../superadmin/superadmin.module';
import { DomainController } from './domain.controller';
import { DnsVerificationService } from './dns-verification.service';
import { CloudflareCustomDomainService } from './cloudflare-custom-domain.service';
import { DomainVerificationCronService } from './domain-verification-cron.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemUser, ActivityLog, Theme, Package]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-me-in-prod',
      signOptions: { expiresIn: '24d' }, // 24 days token expiration
    }),
    SuperadminModule,
    UsersModule,
  ],
  controllers: [SystemuserController, AuthController, DomainController],
  providers: [
    SystemuserService,
    ActivityLogService,
    JwtStrategy,
    CompanyIdService,
    DnsVerificationService,
    CloudflareCustomDomainService,
    DomainVerificationCronService,
  ],
  exports: [JwtModule, PassportModule, CompanyIdService, ActivityLogService, SystemuserService],
})
export class SystemuserModule {}
