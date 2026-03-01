"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
let ProductsSchedulerService = ProductsSchedulerService_1 = class ProductsSchedulerService {
    constructor(productService) {
        this.productService = productService;
        this.logger = new common_1.Logger(ProductsSchedulerService_1.name);
    }
    onModuleInit() {
        setTimeout(() => {
            this.handleAutoDeleteOldTrash();
            this.intervalId = setInterval(() => {
                this.handleAutoDeleteOldTrash();
            }, 24 * 60 * 60 * 1000);
        }, 60 * 60 * 1000);
    }
    async handleAutoDeleteOldTrash() {
        this.logger.log('Starting auto-delete of old trashed products...');
        try {
            const deletedCount = await this.productService.autoDeleteOldTrash();
            this.logger.log(`Auto-deleted ${deletedCount} products from trash (older than 30 days)`);
        }
        catch (error) {
            this.logger.error('Error during auto-delete of old trashed products:', error);
        }
    }
    onModuleDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
};
exports.ProductsSchedulerService = ProductsSchedulerService;
exports.ProductsSchedulerService = ProductsSchedulerService = ProductsSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductService])
], ProductsSchedulerService);
//# sourceMappingURL=products-scheduler.service.js.map