"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocodeModule = void 0;
const common_1 = require("@nestjs/common");
const promocode_service_1 = require("./promocode.service");
const promocode_controller_1 = require("./promocode.controller");
const typeorm_1 = require("@nestjs/typeorm");
const promocode_entity_1 = require("./entities/promocode.entity");
let PromocodeModule = class PromocodeModule {
};
exports.PromocodeModule = PromocodeModule;
exports.PromocodeModule = PromocodeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([promocode_entity_1.PromocodeEntity])],
        controllers: [promocode_controller_1.PromocodeController],
        providers: [promocode_service_1.PromocodeService],
    })
], PromocodeModule);
//# sourceMappingURL=promocode.module.js.map