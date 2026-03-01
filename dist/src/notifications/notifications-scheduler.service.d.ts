import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
export declare class NotificationsSchedulerService implements OnModuleInit, OnModuleDestroy {
    private readonly notificationsService;
    private readonly logger;
    private intervalId;
    constructor(notificationsService: NotificationsService);
    onModuleInit(): void;
    handleAutoDeleteOldNotifications(): Promise<void>;
    onModuleDestroy(): void;
}
