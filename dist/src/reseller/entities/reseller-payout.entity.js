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
exports.ResellerPayout = exports.ResellerPayoutStatus = void 0;
const typeorm_1 = require("typeorm");
var ResellerPayoutStatus;
(function (ResellerPayoutStatus) {
    ResellerPayoutStatus["PENDING"] = "PENDING";
    ResellerPayoutStatus["PAID"] = "PAID";
    ResellerPayoutStatus["REJECTED"] = "REJECTED";
})(ResellerPayoutStatus || (exports.ResellerPayoutStatus = ResellerPayoutStatus = {}));
let ResellerPayout = class ResellerPayout {
};
exports.ResellerPayout = ResellerPayout;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResellerPayout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ResellerPayout.prototype, "resellerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResellerPayout.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], ResellerPayout.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ResellerPayout.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ResellerPayout.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ResellerPayoutStatus,
        default: ResellerPayoutStatus.PENDING,
    }),
    __metadata("design:type", String)
], ResellerPayout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ResellerPayout.prototype, "paymentDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ResellerPayout.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResellerPayout.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResellerPayout.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ResellerPayout.prototype, "updatedAt", void 0);
exports.ResellerPayout = ResellerPayout = __decorate([
    (0, typeorm_1.Entity)('reseller_payouts')
], ResellerPayout);
//# sourceMappingURL=reseller-payout.entity.js.map