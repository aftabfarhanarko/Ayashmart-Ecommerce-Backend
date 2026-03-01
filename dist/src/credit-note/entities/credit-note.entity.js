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
exports.CreditNote = exports.CreditNoteStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const sale_invoice_entity_1 = require("../../sale-invoice/entities/sale-invoice.entity");
var CreditNoteStatus;
(function (CreditNoteStatus) {
    CreditNoteStatus["PAID"] = "Paid";
    CreditNoteStatus["PENDING"] = "Pending";
    CreditNoteStatus["CANCELLED"] = "Cancelled";
})(CreditNoteStatus || (exports.CreditNoteStatus = CreditNoteStatus = {}));
let CreditNote = class CreditNote {
};
exports.CreditNote = CreditNote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CreditNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "creditNoteNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CreditNote.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CreditNote.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", user_entity_1.User)
], CreditNote.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CreditNote.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_invoice_entity_1.SaleInvoice, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'invoiceId' }),
    __metadata("design:type", sale_invoice_entity_1.SaleInvoice)
], CreditNote.prototype, "relatedInvoice", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CreditNote.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Cash' }),
    __metadata("design:type", String)
], CreditNote.prototype, "paymentMode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CreditNoteStatus,
        default: CreditNoteStatus.PENDING,
    }),
    __metadata("design:type", String)
], CreditNote.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CreditNote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CreditNote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], CreditNote.prototype, "deletedAt", void 0);
exports.CreditNote = CreditNote = __decorate([
    (0, typeorm_1.Entity)('credit_notes')
], CreditNote);
//# sourceMappingURL=credit-note.entity.js.map