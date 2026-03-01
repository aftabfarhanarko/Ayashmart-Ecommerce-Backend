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
var NotificationsSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
let NotificationsSchedulerService = NotificationsSchedulerService_1 = class NotificationsSchedulerService {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(NotificationsSchedulerService_1.name);
    }
    onModuleInit() {
        const runInterval = () => {
            this.handleAutoDeleteOldNotifications();
        };
        setTimeout(() => {
            runInterval();
            this.intervalId = setInterval(runInterval, 60 * 60 * 1000);
        }, 5 * 60 * 1000);
    }
    async handleAutoDeleteOldNotifications() {
        this.logger.log('Starting auto-delete of notifications older than 24 hours...');
        try {
            const deletedCount = await this.notificationsService.deleteOlderThan24Hours();
            if (deletedCount > 0) {
                this.logger.log(`Auto-deleted ${deletedCount} notifications (older than 24 hours)`);
            }
        }
        catch (error) {
            this.logger.error('Error during auto-delete of old notifications:', error);
        }
    }
    onModuleDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
};
exports.NotificationsSchedulerService = NotificationsSchedulerService;
exports.NotificationsSchedulerService = NotificationsSchedulerService = NotificationsSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsSchedulerService);
//# sourceMappingURL=notifications-scheduler.service.js.map