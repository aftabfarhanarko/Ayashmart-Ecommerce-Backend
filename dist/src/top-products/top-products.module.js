"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const top_products_controller_1 = require("./top-products.controller");
const top_products_service_1 = require("./top-products.service");
const top_products_section_entity_1 = require("./entities/top-products-section.entity");
const top_products_item_entity_1 = require("./entities/top-products-item.entity");
let TopProductsModule = class TopProductsModule {
};
exports.TopProductsModule = TopProductsModule;
exports.TopProductsModule = TopProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([top_products_section_entity_1.TopProductsSectionEntity, top_products_item_entity_1.TopProductsItemEntity])],
        controllers: [top_products_controller_1.TopProductsController],
        providers: [top_products_service_1.TopProductsService],
        exports: [top_products_service_1.TopProductsService],
    })
], TopProductsModule);
//# sourceMappingURL=top-products.module.js.map