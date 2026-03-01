"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TremsCondetionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trems_condetions_service_1 = require("./trems-condetions.service");
const trems_condetions_controller_1 = require("./trems-condetions.controller");
const trems_condetion_entity_1 = require("./entities/trems-condetion.entity");
let TremsCondetionsModule = class TremsCondetionsModule {
};
exports.TremsCondetionsModule = TremsCondetionsModule;
exports.TremsCondetionsModule = TremsCondetionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([trems_condetion_entity_1.TremsCondetion])],
        controllers: [trems_condetions_controller_1.TremsCondetionsController],
        providers: [trems_condetions_service_1.TremsCondetionsService],
        exports: [trems_condetions_service_1.TremsCondetionsService],
    })
], TremsCondetionsModule);
//# sourceMappingURL=trems-condetions.module.js.map