"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const overview_controller_1 = require("./overview.controller");
const overview_service_1 = require("./overview.service");
const systemuser_entity_1 = require("../systemuser/entities/systemuser.entity");
const user_entity_1 = require("../users/entities/user.entity");
const help_entity_1 = require("../help/entities/help.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const invoice_entity_1 = require("../invoice/entities/invoice.entity");
let OverviewModule = class OverviewModule {
};
exports.OverviewModule = OverviewModule;
exports.OverviewModule = OverviewModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([systemuser_entity_1.SystemUser, user_entity_1.User, help_entity_1.Help, order_entity_1.Order, invoice_entity_1.Invoice])],
        controllers: [overview_controller_1.OverviewController],
        providers: [overview_service_1.OverviewService],
        exports: [overview_service_1.OverviewService],
    })
], OverviewModule);
//# sourceMappingURL=overview.module.js.map