import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Setting } from './entities/setting.entity';
import { RequestContextService } from '../common/services/request-context.service';
import { SuperadminSettingController } from './superadmin-setting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController, SuperadminSettingController],
  providers: [SettingService, RequestContextService],
  exports: [SettingService],
})
export class SettingModule {}
