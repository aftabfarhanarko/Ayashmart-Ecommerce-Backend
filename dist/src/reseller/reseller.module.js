"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResellerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reseller_controller_1 = require("./reseller.controller");
const reseller_service_1 = require("./reseller.service");
const product_entity_1 = require("../products/entities/product.entity");
const sale_invoice_item_entity_1 = require("../sale-invoice/entities/sale-invoice-item.entity");
const reseller_payout_entity_1 = require("./entities/reseller-payout.entity");
const systemuser_entity_1 = require("../systemuser/entities/systemuser.entity");
let ResellerModule = class ResellerModule {
};
exports.ResellerModule = ResellerModule;
exports.ResellerModule = ResellerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.ProductEntity, sale_invoice_item_entity_1.SaleInvoiceItem, reseller_payout_entity_1.ResellerPayout, systemuser_entity_1.SystemUser]),
        ],
        controllers: [reseller_controller_1.ResellerController],
        providers: [reseller_service_1.ResellerService],
    })
], ResellerModule);
//# sourceMappingURL=reseller.module.js.map