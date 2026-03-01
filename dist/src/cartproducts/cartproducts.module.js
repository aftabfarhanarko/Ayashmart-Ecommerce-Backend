"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartproductsModule = void 0;
const common_1 = require("@nestjs/common");
const cartproducts_service_1 = require("./cartproducts.service");
const cartproducts_controller_1 = require("./cartproducts.controller");
const typeorm_1 = require("@nestjs/typeorm");
const cartproduct_entity_1 = require("./entities/cartproduct.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const orders_module_1 = require("../orders/orders.module");
const request_context_service_1 = require("../common/services/request-context.service");
let CartproductsModule = class CartproductsModule {
};
exports.CartproductsModule = CartproductsModule;
exports.CartproductsModule = CartproductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cartproduct_entity_1.Cartproduct, product_entity_1.ProductEntity, user_entity_1.User]), orders_module_1.OrdersModule],
        controllers: [cartproducts_controller_1.CartproductsController],
        providers: [cartproducts_service_1.CartproductsService, request_context_service_1.RequestContextService],
    })
], CartproductsModule);
//# sourceMappingURL=cartproducts.module.js.map