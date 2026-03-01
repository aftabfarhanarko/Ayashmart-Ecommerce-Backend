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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationChannel = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
var NotificationType;
(function (NotificationType) {
    NotificationType["ORDER_CREATED"] = "order_created";
    NotificationType["ORDER_CONFIRMED"] = "order_confirmed";
    NotificationType["ORDER_PROCESSING"] = "order_processing";
    NotificationType["ORDER_SHIPPED"] = "order_shipped";
    NotificationType["ORDER_DELIVERED"] = "order_delivered";
    NotificationType["ORDER_CANCELLED"] = "order_cancelled";
    NotificationType["ORDER_REFUNDED"] = "order_refunded";
    NotificationType["PAYMENT_RECEIVED"] = "payment_received";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["NEW_CUSTOMER"] = "new_customer";
    NotificationType["CUSTOMER_UPDATED"] = "customer_updated";
    NotificationType["LOW_STOCK"] = "low_stock";
    NotificationType["OUT_OF_STOCK"] = "out_of_stock";
    NotificationType["PRODUCT_ADDED"] = "product_added";
    NotificationType["PRODUCT_UPDATED"] = "product_updated";
    NotificationType["BROADCAST_EMAIL"] = "broadcast_email";
    NotificationType["BROADCAST_SMS"] = "broadcast_sms";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["WHATSAPP"] = "whatsapp";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Notification.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationChannel }),
    __metadata("design:type", String)
], Notification.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'sent' }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, typeorm_1.Index)(['companyId', 'type']),
    (0, typeorm_1.Index)(['companyId', 'createdAt'])
], Notification);
//# sourceMappingURL=notification.entity.js.map