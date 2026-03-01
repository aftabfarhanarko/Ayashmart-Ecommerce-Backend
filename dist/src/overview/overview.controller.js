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
exports.OverviewController = void 0;
const common_1 = require("@nestjs/common");
const overview_service_1 = require("./overview.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let OverviewController = class OverviewController {
    constructor(overviewService) {
        this.overviewService = overviewService;
    }
    getOverview() {
        return this.overviewService.getOverview();
    }
};
exports.OverviewController = OverviewController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OverviewController.prototype, "getOverview", null);
exports.OverviewController = OverviewController = __decorate([
    (0, common_1.Controller)('overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [overview_service_1.OverviewService])
], OverviewController);
//# sourceMappingURL=overview.controller.js.map