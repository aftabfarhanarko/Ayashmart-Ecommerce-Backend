import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProductService } from './products.service';

@Injectable()
export class ProductsSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(ProductsSchedulerService.name);
  private intervalId: NodeJS.Timeout;

  constructor(private readonly productService: ProductService) {}

  onModuleInit() {
    // Run auto-delete check every 24 hours (86400000 ms)
    // First run after 1 hour to allow server to start
    setTimeout(() => {
      this.handleAutoDeleteOldTrash();
      // Then run every 24 hours
      this.intervalId = setInterval(() => {
        this.handleAutoDeleteOldTrash();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, 60 * 60 * 1000); // 1 hour delay on startup
  }

  async handleAutoDeleteOldTrash() {
    this.logger.log('Starting auto-delete of old trashed products...');
    try {
      const deletedCount = await this.productService.autoDeleteOldTrash();
      this.logger.log(`Auto-deleted ${deletedCount} products from trash (older than 30 days)`);
    } catch (error) {
      this.logger.error('Error during auto-delete of old trashed products:', error);
    }
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
