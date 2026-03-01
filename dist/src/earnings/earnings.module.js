"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const earnings_controller_1 = require("./earnings.controller");
const earnings_service_1 = require("./earnings.service");
const systemuser_entity_1 = require("../systemuser/entities/systemuser.entity");
const invoice_entity_1 = require("../invoice/entities/invoice.entity");
let EarningsModule = class EarningsModule {
};
exports.EarningsModule = EarningsModule;
exports.EarningsModule = EarningsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([systemuser_entity_1.SystemUser, invoice_entity_1.Invoice])],
        controllers: [earnings_controller_1.EarningsController],
        providers: [earnings_service_1.EarningsService],
        exports: [earnings_service_1.EarningsService],
    })
], EarningsModule);
//# sourceMappingURL=earnings.module.js.map