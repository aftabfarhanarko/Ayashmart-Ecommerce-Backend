"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const track_order_controller_1 = require("./track-order.controller");
const payments_module_1 = require("../payments/payments.module");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_status_history_entity_1 = require("./entities/order-status-history.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const notifications_module_1 = require("../notifications/notifications.module");
const systemuser_module_1 = require("../systemuser/systemuser.module");
const voice_module_1 = require("../voice/voice.module");
const common_2 = require("@nestjs/common");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            systemuser_module_1.SystemuserModule,
            (0, common_2.forwardRef)(() => voice_module_1.VoiceModule),
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                order_status_history_entity_1.OrderStatusHistory,
                product_entity_1.ProductEntity,
                user_entity_1.User,
            ]),
        ],
        controllers: [orders_controller_1.OrderController, track_order_controller_1.TrackOrderController],
        providers: [orders_service_1.OrderService],
        exports: [orders_service_1.OrderService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map