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
exports.SaleInvoice = exports.SaleInvoiceStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const sale_invoice_item_entity_1 = require("./sale-invoice-item.entity");
var SaleInvoiceStatus;
(function (SaleInvoiceStatus) {
    SaleInvoiceStatus["DRAFT"] = "draft";
    SaleInvoiceStatus["PENDING"] = "pending";
    SaleInvoiceStatus["SENT"] = "sent";
    SaleInvoiceStatus["PAID"] = "paid";
    SaleInvoiceStatus["PARTIAL"] = "partial";
    SaleInvoiceStatus["OVERDUE"] = "overdue";
    SaleInvoiceStatus["CANCELLED"] = "cancelled";
})(SaleInvoiceStatus || (exports.SaleInvoiceStatus = SaleInvoiceStatus = {}));
let SaleInvoice = class SaleInvoice {
};
exports.SaleInvoice = SaleInvoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SaleInvoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], SaleInvoice.prototype, "invoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SaleInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SaleInvoiceStatus,
        default: SaleInvoiceStatus.DRAFT,
    }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "deliveryStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "fulfillmentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleInvoice.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleInvoice.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", user_entity_1.User)
], SaleInvoice.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'BDT' }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SaleInvoice.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "recurringInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "termsAndConditions", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], SaleInvoice.prototype, "bankDetails", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SaleInvoice.prototype, "subTotal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SaleInvoice.prototype, "taxTotal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SaleInvoice.prototype, "discountTotal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SaleInvoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "signatureName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleInvoice.prototype, "signatureImage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_invoice_item_entity_1.SaleInvoiceItem, (item) => item.invoice, { cascade: true }),
    __metadata("design:type", Array)
], SaleInvoice.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SaleInvoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SaleInvoice.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], SaleInvoice.prototype, "deletedAt", void 0);
exports.SaleInvoice = SaleInvoice = __decorate([
    (0, typeorm_1.Entity)('sale_invoices')
], SaleInvoice);
//# sourceMappingURL=sale-invoice.entity.js.map