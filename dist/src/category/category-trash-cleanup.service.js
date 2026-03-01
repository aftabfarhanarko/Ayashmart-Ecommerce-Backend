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
var CategoryTrashCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryTrashCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const category_service_1 = require("./category.service");
let CategoryTrashCleanupService = CategoryTrashCleanupService_1 = class CategoryTrashCleanupService {
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.logger = new common_1.Logger(CategoryTrashCleanupService_1.name);
    }
    async purgeExpiredTrashedCategories() {
        try {
            const deleted = await this.categoryService.hardDeleteTrashedOlderThanDays(7);
            if (deleted > 0) {
                this.logger.log(`Purged ${deleted} trashed categories older than 7 days`);
            }
        }
        catch (e) {
            this.logger.error('Failed to purge expired trashed categories', e);
        }
    }
};
exports.CategoryTrashCleanupService = CategoryTrashCleanupService;
__decorate([
    (0, schedule_1.Cron)('10 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryTrashCleanupService.prototype, "purgeExpiredTrashedCategories", null);
exports.CategoryTrashCleanupService = CategoryTrashCleanupService = CategoryTrashCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryTrashCleanupService);
//# sourceMappingURL=category-trash-cleanup.service.js.map