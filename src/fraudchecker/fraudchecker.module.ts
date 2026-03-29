import { Module } from '@nestjs/common';
import { FraudcheckerService } from './fraudchecker.service';
import { FraudcheckerController } from './fraudchecker.controller';
import { UsersModule } from '../users/users.module';
import { RequestContextService } from '../common/services/request-context.service';
import { SettingModule } from '../setting/setting.module';

@Module({
  imports: [UsersModule, SettingModule],
  controllers: [FraudcheckerController],
  providers: [FraudcheckerService, RequestContextService],
})
export class FraudcheckerModule {}
