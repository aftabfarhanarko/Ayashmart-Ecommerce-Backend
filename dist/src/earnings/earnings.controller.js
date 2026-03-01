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
exports.EarningsController = void 0;
const common_1 = require("@nestjs/common");
const earnings_service_1 = require("./earnings.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let EarningsController = class EarningsController {
    constructor(earningsService) {
        this.earningsService = earningsService;
    }
    getEarningsOverview() {
        return this.earningsService.getEarningsOverview();
    }
};
exports.EarningsController = EarningsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EarningsController.prototype, "getEarningsOverview", null);
exports.EarningsController = EarningsController = __decorate([
    (0, common_1.Controller)('earnings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [earnings_service_1.EarningsService])
], EarningsController);
//# sourceMappingURL=earnings.controller.js.map