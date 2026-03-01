import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsSchedulerService } from './notifications-scheduler.service';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { RequestContextService } from '../common/services/request-context.service';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    HttpModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsSchedulerService, RequestContextService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

