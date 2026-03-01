import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from './entities/superadmin.entity';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WildcardDomainService } from '../common/services/wildcard-domain.service';
import { WildcardBootstrapService } from '../common/services/wildcard-bootstrap.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperAdmin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-me-in-prod',
      signOptions: { expiresIn: '24d' },
    }),
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService, WildcardDomainService, WildcardBootstrapService],
  exports: [SuperadminService, JwtModule, PassportModule, WildcardDomainService],
})
export class SuperadminModule {}
