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
exports.ActivityLog = exports.ActivityEntity = exports.ActivityAction = void 0;
const typeorm_1 = require("typeorm");
const systemuser_entity_1 = require("./systemuser.entity");
var ActivityAction;
(function (ActivityAction) {
    ActivityAction["CREATE"] = "CREATE";
    ActivityAction["UPDATE"] = "UPDATE";
    ActivityAction["DELETE"] = "DELETE";
    ActivityAction["LOGIN"] = "LOGIN";
    ActivityAction["LOGOUT"] = "LOGOUT";
    ActivityAction["PERMISSION_ASSIGN"] = "PERMISSION_ASSIGN";
    ActivityAction["PERMISSION_REVOKE"] = "PERMISSION_REVOKE";
    ActivityAction["STATUS_CHANGE"] = "STATUS_CHANGE";
    ActivityAction["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    ActivityAction["BARCODE_SCAN"] = "BARCODE_SCAN";
})(ActivityAction || (exports.ActivityAction = ActivityAction = {}));
var ActivityEntity;
(function (ActivityEntity) {
    ActivityEntity["SYSTEM_USER"] = "SYSTEM_USER";
    ActivityEntity["PRODUCT"] = "PRODUCT";
    ActivityEntity["ORDER"] = "ORDER";
    ActivityEntity["CATEGORY"] = "CATEGORY";
    ActivityEntity["CUSTOMER"] = "CUSTOMER";
    ActivityEntity["INVENTORY"] = "INVENTORY";
    ActivityEntity["BANNER"] = "BANNER";
    ActivityEntity["PROMOCODE"] = "PROMOCODE";
})(ActivityEntity || (exports.ActivityEntity = ActivityEntity = {}));
let ActivityLog = class ActivityLog {
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ActivityLog.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityAction,
        nullable: false,
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityEntity,
        nullable: false,
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ActivityLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "oldValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "newValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ActivityLog.prototype, "performedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => systemuser_entity_1.SystemUser, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'performedByUserId' }),
    __metadata("design:type", systemuser_entity_1.SystemUser)
], ActivityLog.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ActivityLog.prototype, "targetUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => systemuser_entity_1.SystemUser, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'targetUserId' }),
    __metadata("design:type", systemuser_entity_1.SystemUser)
], ActivityLog.prototype, "targetUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "createdAt", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('activity_logs')
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map