import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsSchedulerService.name);
  private intervalId: NodeJS.Timeout;

  constructor(private readonly notificationsService: NotificationsService) {}

  onModuleInit() {
    // Run auto-delete every hour
    const runInterval = () => {
      this.handleAutoDeleteOldNotifications();
    };
    // First run after 5 minutes to allow server to start
    setTimeout(() => {
      runInterval();
      this.intervalId = setInterval(runInterval, 60 * 60 * 1000); // Every hour
    }, 5 * 60 * 1000);
  }

  async handleAutoDeleteOldNotifications() {
    this.logger.log('Starting auto-delete of notifications older than 24 hours...');
    try {
      const deletedCount = await this.notificationsService.deleteOlderThan24Hours();
      if (deletedCount > 0) {
        this.logger.log(`Auto-deleted ${deletedCount} notifications (older than 24 hours)`);
      }
    } catch (error) {
      this.logger.error('Error during auto-delete of old notifications:', error);
    }
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
