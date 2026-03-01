import { Module } from '@nestjs/common';
import { FraudcheckerService } from './fraudchecker.service';
import { FraudcheckerController } from './fraudchecker.controller';
import { UsersModule } from '../users/users.module';
import { RequestContextService } from '../common/services/request-context.service';

@Module({
  imports: [UsersModule],
  controllers: [FraudcheckerController],
  providers: [FraudcheckerService, RequestContextService],
})
export class FraudcheckerModule {}
