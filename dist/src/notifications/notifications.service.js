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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const request_context_service_1 = require("../common/services/request-context.service");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationsService = class NotificationsService {
    constructor(usersService, mailer, httpService, requestContextService, notificationRepo) {
        this.usersService = usersService;
        this.mailer = mailer;
        this.httpService = httpService;
        this.requestContextService = requestContextService;
        this.notificationRepo = notificationRepo;
    }
    async sendEmailToCustomers(dto) {
        const companyId = this.requestContextService.getCompanyId();
        const customerRecipients = dto.customerIds?.length
            ? (await this.usersService.findCustomers(companyId, { ids: dto.customerIds })).filter((u) => !!u.email)
            : [];
        const targets = customerRecipients.map((u) => ({
            email: u.email,
            name: u.name,
            id: u.id,
        }));
        if (dto.emails?.length) {
            dto.emails.forEach((email) => {
                if (!targets.some((t) => t.email.toLowerCase() === email.toLowerCase())) {
                    targets.push({ email });
                }
            });
        }
        if (!targets.length) {
            throw new common_1.NotFoundException('No customers with a valid email address were found');
        }
        const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER;
        const results = await Promise.allSettled(targets.map((target) => {
            const personalizedBody = dto.body.replace(/{{\s*name\s*}}/gi, target.name ?? 'there');
            return this.mailer.sendMail({
                companyId,
                from: fromAddress,
                to: target.email,
                subject: dto.subject,
                text: personalizedBody,
                html: dto.html,
            });
        }));
        const failed = [];
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                failed.push({
                    userId: targets[index].id,
                    contact: targets[index].email,
                    reason: result.reason?.message ?? 'Unknown error',
                });
            }
        });
        return {
            channel: 'email',
            totalRecipients: targets.length,
            delivered: targets.length - failed.length,
            failed: failed.length,
            failedRecipients: failed,
        };
    }
    async sendSmsToCustomers(dto) {
        const companyId = this.requestContextService.getCompanyId();
        const recipients = (await this.usersService.findCustomers(companyId)).filter((user) => !!user.phone);
        if (!recipients.length) {
            throw new common_1.NotFoundException('No customers with a phone number were found');
        }
        const config = this.getSmsConfig();
        const results = await Promise.allSettled(recipients.map((user) => this.dispatchSms(config, user.phone, dto.message)));
        return this.buildSummary('sms', recipients, results);
    }
    buildSummary(channel, recipients, results) {
        const failed = [];
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                failed.push({
                    userId: recipients[index].id,
                    contact: channel === 'email' ? recipients[index].email : recipients[index].phone,
                    reason: result.reason?.message ?? 'Unknown error',
                });
            }
        });
        return {
            channel,
            totalRecipients: recipients.length,
            delivered: recipients.length - failed.length,
            failed: failed.length,
            failedRecipients: failed,
        };
    }
    getSmsConfig() {
        const apiUrl = process.env.SMS_API_URL;
        const apiKey = process.env.SMS_API_KEY;
        const senderId = process.env.SMS_SENDER_ID ?? 'ECOMM';
        if (!apiUrl || !apiKey) {
            throw new common_1.ServiceUnavailableException('SMS provider is not configured');
        }
        return { apiUrl, apiKey, senderId };
    }
    async dispatchSms(config, to, message) {
        await (0, rxjs_1.firstValueFrom)(this.httpService.post(config.apiUrl, {
            to,
            message,
            senderId: config.senderId,
        }, {
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
            },
        }));
    }
    async sendOwnerEmail(ownerEmail, subject, body, companyId, orderId) {
        try {
            const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER;
            const info = await this.mailer.sendMail({
                companyId,
                from: fromAddress,
                to: ownerEmail,
                subject,
                text: body,
            });
            if (process.env.NODE_ENV !== 'production') {
                console.log('Owner email sent:', info?.id);
            }
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: notification_entity_1.NotificationType.ORDER_CREATED,
                    channel: notification_entity_1.NotificationChannel.EMAIL,
                    recipient: ownerEmail,
                    subject,
                    message: body,
                    status: 'sent',
                    orderId,
                });
            }
            return { success: true };
        }
        catch (error) {
            console.error('Failed to send owner email:', error);
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: notification_entity_1.NotificationType.ORDER_CREATED,
                    channel: notification_entity_1.NotificationChannel.EMAIL,
                    recipient: ownerEmail,
                    subject,
                    message: body,
                    status: 'failed',
                    orderId,
                    metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
                });
            }
            return { success: false, error };
        }
    }
    async sendOwnerWhatsApp(ownerWhatsapp, message, companyId, orderId) {
        try {
            const config = this.getSmsConfig();
            await this.dispatchSms(config, ownerWhatsapp, message);
            if (process.env.NODE_ENV !== 'production') {
                console.log('Owner WhatsApp sent to:', ownerWhatsapp);
            }
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: notification_entity_1.NotificationType.ORDER_CREATED,
                    channel: notification_entity_1.NotificationChannel.WHATSAPP,
                    recipient: ownerWhatsapp,
                    message,
                    status: 'sent',
                    orderId,
                });
            }
            return { success: true };
        }
        catch (error) {
            console.error('Failed to send owner WhatsApp:', error);
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: notification_entity_1.NotificationType.ORDER_CREATED,
                    channel: notification_entity_1.NotificationChannel.WHATSAPP,
                    recipient: ownerWhatsapp,
                    message,
                    status: 'failed',
                    orderId,
                    metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
                });
            }
            return { success: false, error };
        }
    }
    async saveNotification(data) {
        try {
            const notification = this.notificationRepo.create(data);
            await this.notificationRepo.save(notification);
        }
        catch (error) {
            console.error('Failed to save notification record:', error);
        }
    }
    async saveOrderCreatedForNavbar(companyId, orderId, subject, message) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.ORDER_CREATED,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject,
            message,
            status: 'sent',
            orderId,
        });
    }
    async saveNewCustomerNotification(companyId, customerName, customerEmail) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.NEW_CUSTOMER,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'New Customer Registered',
            message: `New customer ${customerName}${customerEmail ? ` (${customerEmail})` : ''} has registered.`,
            status: 'sent',
        });
    }
    async saveCustomerUpdatedNotification(companyId, customerName, customerId) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.CUSTOMER_UPDATED,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Customer Profile Updated',
            message: `Customer ${customerName} (ID: ${customerId}) has updated their profile.`,
            status: 'sent',
            metadata: { customerId },
        });
    }
    async saveProductAddedNotification(companyId, productName, productId, sku) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.PRODUCT_ADDED,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'New Product Added',
            message: `New product "${productName}"${sku ? ` (${sku})` : ''} has been added to your catalog.`,
            status: 'sent',
            metadata: { productId },
        });
    }
    async saveProductUpdatedNotification(companyId, productName, productId, sku) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.PRODUCT_UPDATED,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Product Updated',
            message: `Product "${productName}"${sku ? ` (${sku})` : ''} has been updated.`,
            status: 'sent',
            metadata: { productId },
        });
    }
    async saveLowStockNotification(companyId, productName, productId, stock, sku) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.LOW_STOCK,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Low Stock Alert',
            message: `Product "${productName}"${sku ? ` (${sku})` : ''} is running low on stock. Current stock: ${stock}.`,
            status: 'sent',
            metadata: { productId, stock },
        });
    }
    async saveOutOfStockNotification(companyId, productName, productId, sku) {
        await this.saveNotification({
            companyId,
            type: notification_entity_1.NotificationType.OUT_OF_STOCK,
            channel: notification_entity_1.NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Out of Stock Alert',
            message: `Product "${productName}"${sku ? ` (${sku})` : ''} is out of stock. Please restock.`,
            status: 'sent',
            metadata: { productId },
        });
    }
    async getNotificationsByCompanyAndType(companyId, type) {
        const where = { companyId };
        if (type) {
            where.type = type;
        }
        return this.notificationRepo.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async getNotificationsByCompany(companyId) {
        return this.notificationRepo.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
        });
    }
    async markAsRead(id, companyId) {
        const notification = await this.notificationRepo.findOne({
            where: { id, companyId },
        });
        if (!notification)
            return null;
        notification.isRead = true;
        await this.notificationRepo.save(notification);
        return notification;
    }
    async markAllAsRead(companyId) {
        await this.notificationRepo.update({ companyId, isRead: false }, { isRead: true });
        return { success: true };
    }
    async deleteOlderThan24Hours() {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await this.notificationRepo.delete({
            createdAt: (0, typeorm_2.LessThan)(cutoff),
        });
        return result.affected ?? 0;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(1, (0, common_1.Inject)('MAILER_TRANSPORT')),
    __param(4, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [users_service_1.UsersService, Object, axios_1.HttpService,
        request_context_service_1.RequestContextService,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map