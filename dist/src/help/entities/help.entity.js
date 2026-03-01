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
exports.Help = exports.SupportStatus = void 0;
const typeorm_1 = require("typeorm");
var SupportStatus;
(function (SupportStatus) {
    SupportStatus["PENDING"] = "pending";
    SupportStatus["IN_PROGRESS"] = "in_progress";
    SupportStatus["RESOLVED"] = "resolved";
})(SupportStatus || (exports.SupportStatus = SupportStatus = {}));
let Help = class Help {
};
exports.Help = Help;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Help.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Help.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Help.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: SupportStatus.PENDING }),
    __metadata("design:type", String)
], Help.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Help.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, default: 'medium' }),
    __metadata("design:type", String)
], Help.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], Help.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], Help.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], Help.prototype, "replies", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Help.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Help.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Help.prototype, "deletedAt", void 0);
exports.Help = Help = __decorate([
    (0, typeorm_1.Entity)('tbl_support')
], Help);
//# sourceMappingURL=help.entity.js.map