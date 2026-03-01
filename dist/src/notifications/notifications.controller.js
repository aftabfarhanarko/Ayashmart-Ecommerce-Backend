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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const broadcast_email_dto_1 = require("./dto/broadcast-email.dto");
const broadcast_sms_dto_1 = require("./dto/broadcast-sms.dto");
const notification_entity_1 = require("./entities/notification.entity");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const request_context_service_1 = require("../common/services/request-context.service");
let NotificationsController = class NotificationsController {
    constructor(notificationsService, requestContextService) {
        this.notificationsService = notificationsService;
        this.requestContextService = requestContextService;
    }
    async getAllNotifications(type, queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        const notifications = await this.notificationsService.getNotificationsByCompanyAndType(companyId, type);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notifications retrieved successfully',
            data: notifications,
        };
    }
    async markAllAsRead(queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        await this.notificationsService.markAllAsRead(companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'All notifications marked as read',
        };
    }
    async markAsRead(id, queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        const notification = await this.notificationsService.markAsRead(id, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notification marked as read',
            data: notification,
        };
    }
    async getOrderCreatedNotifications(queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        const notifications = await this.notificationsService.getNotificationsByCompanyAndType(companyId, notification_entity_1.NotificationType.ORDER_CREATED);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Order created notifications retrieved successfully',
            data: notifications,
        };
    }
    async getOrderStatusNotifications(queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        const allNotifications = await this.notificationsService.getNotificationsByCompany(companyId);
        const orderNotifications = allNotifications.filter(n => n.type.startsWith('order_') || n.type === notification_entity_1.NotificationType.PAYMENT_RECEIVED || n.type === notification_entity_1.NotificationType.PAYMENT_FAILED);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Order status notifications retrieved successfully',
            data: orderNotifications,
        };
    }
    async getNewCustomerNotifications(queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        const notifications = await this.notificationsService.getNotificationsByCompanyAndType(companyId, notification_entity_1.NotificationType.NEW_CUSTOMER);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'New customer notifications retrieved successfully',
            data: notifications,
        };
    }
    async getLowStockNotifications(queryCompanyId) {
        const companyId = queryCompanyId || this.requestContextService.getCompanyId();
        const allNotifications = await this.notificationsService.getNotificationsByCompany(companyId);
        const stockNotifications = allNotifications.filter(n => n.type === notification_entity_1.NotificationType.LOW_STOCK || n.type === notification_entity_1.NotificationType.OUT_OF_STOCK);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Stock notifications retrieved successfully',
            data: stockNotifications,
        };
    }
    async broadcastEmail(dto) {
        const summary = await this.notificationsService.sendEmailToCustomers(dto);
        return {
            statusCode: common_1.HttpStatus.ACCEPTED,
            message: 'Customer email broadcast triggered',
            data: summary,
        };
    }
    async broadcastSms(dto) {
        const summary = await this.notificationsService.sendSmsToCustomers(dto);
        return {
            statusCode: common_1.HttpStatus.ACCEPTED,
            message: 'Customer SMS broadcast triggered',
            data: summary,
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllNotifications", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('order-created'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getOrderCreatedNotifications", null);
__decorate([
    (0, common_1.Get)('order-status'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getOrderStatusNotifications", null);
__decorate([
    (0, common_1.Get)('new-customers'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNewCustomerNotifications", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getLowStockNotifications", null);
__decorate([
    (0, common_1.Post)('email/customers'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [broadcast_email_dto_1.BroadcastEmailDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "broadcastEmail", null);
__decorate([
    (0, common_1.Post)('sms/customers'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [broadcast_sms_dto_1.BroadcastSmsDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "broadcastSms", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        request_context_service_1.RequestContextService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map