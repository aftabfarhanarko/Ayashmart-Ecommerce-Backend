"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const category_controller_1 = require("./category.controller");
const public_category_controller_1 = require("./public-category.controller");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./entities/category.entity");
const systemuser_module_1 = require("../systemuser/systemuser.module");
const dashboard_module_1 = require("../dashboard/dashboard.module");
const category_trash_cleanup_service_1 = require("./category-trash-cleanup.service");
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([category_entity_1.CategoryEntity]),
            systemuser_module_1.SystemuserModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [category_controller_1.CategoryController, public_category_controller_1.PublicCategoryController],
        providers: [category_service_1.CategoryService, category_trash_cleanup_service_1.CategoryTrashCleanupService],
    })
], CategoryModule);
//# sourceMappingURL=category.module.js.map