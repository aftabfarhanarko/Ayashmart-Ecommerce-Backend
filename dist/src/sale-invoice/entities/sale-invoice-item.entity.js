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
exports.SaleInvoiceItem = exports.ItemType = void 0;
const typeorm_1 = require("typeorm");
const sale_invoice_entity_1 = require("./sale-invoice.entity");
const product_entity_1 = require("../../products/entities/product.entity");
var ItemType;
(function (ItemType) {
    ItemType["PRODUCT"] = "product";
    ItemType["SERVICE"] = "service";
})(ItemType || (exports.ItemType = ItemType = {}));
let SaleInvoiceItem = class SaleInvoiceItem {
};
exports.SaleInvoiceItem = SaleInvoiceItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_invoice_entity_1.SaleInvoice, (invoice) => invoice.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'invoiceId' }),
    __metadata("design:type", sale_invoice_entity_1.SaleInvoice)
], SaleInvoiceItem.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], SaleInvoiceItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleInvoiceItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ItemType,
        default: ItemType.PRODUCT,
    }),
    __metadata("design:type", String)
], SaleInvoiceItem.prototype, "itemType", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleInvoiceItem.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "tax", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], SaleInvoiceItem.prototype, "amount", void 0);
exports.SaleInvoiceItem = SaleInvoiceItem = __decorate([
    (0, typeorm_1.Entity)('sale_invoice_items')
], SaleInvoiceItem);
//# sourceMappingURL=sale-invoice-item.entity.js.map