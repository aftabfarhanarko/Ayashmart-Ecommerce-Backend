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
exports.TrackOrderController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TrackOrderController = class TrackOrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async track(trackingId) {
        const data = await this.orderService.findByTrackingId(trackingId);
        return { statusCode: 200, message: "Order found", data };
    }
};
exports.TrackOrderController = TrackOrderController;
__decorate([
    (0, common_1.Get)("track/:trackingId"),
    __param(0, (0, common_1.Param)("trackingId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackOrderController.prototype, "track", null);
exports.TrackOrderController = TrackOrderController = __decorate([
    (0, common_1.Controller)("orders"),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [orders_service_1.OrderService])
], TrackOrderController);
//# sourceMappingURL=track-order.controller.js.map