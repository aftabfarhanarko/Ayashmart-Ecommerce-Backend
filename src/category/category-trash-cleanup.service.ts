import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryTrashCleanupService {
  private readonly logger = new Logger(CategoryTrashCleanupService.name);

  constructor(private readonly categoryService: CategoryService) {}

  // Runs daily at 03:10 server time
  @Cron('10 3 * * *')
  async purgeExpiredTrashedCategories() {
    try {
      // TypeScript language service can get confused in some setups;
      // keep runtime call explicit.
      const deleted = await (this.categoryService as any).hardDeleteTrashedOlderThanDays(7);
      if (deleted > 0) {
        this.logger.log(`Purged ${deleted} trashed categories older than 7 days`);
      }
    } catch (e) {
      this.logger.error('Failed to purge expired trashed categories', e as any);
    }
  }
}

