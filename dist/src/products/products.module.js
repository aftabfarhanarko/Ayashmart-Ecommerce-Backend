"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const public_products_controller_1 = require("./public-products.controller");
const products_scheduler_service_1 = require("./products-scheduler.service");
const image_search_service_1 = require("./image-search.service");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("../category/entities/category.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const systemuser_module_1 = require("../systemuser/systemuser.module");
const notifications_module_1 = require("../notifications/notifications.module");
const dashboard_module_1 = require("../dashboard/dashboard.module");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.ProductEntity, category_entity_1.CategoryEntity, order_entity_1.Order]),
            systemuser_module_1.SystemuserModule,
            notifications_module_1.NotificationsModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [products_controller_1.ProductController, public_products_controller_1.PublicProductController],
        providers: [products_service_1.ProductService, products_scheduler_service_1.ProductsSchedulerService, image_search_service_1.ImageSearchService, jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard],
    })
], ProductModule);
//# sourceMappingURL=products.module.js.map