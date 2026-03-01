"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpModule = void 0;
const common_1 = require("@nestjs/common");
const help_service_1 = require("./help.service");
const help_controller_1 = require("./help.controller");
const help_support_gateway_1 = require("./help-support.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const help_entity_1 = require("./entities/help.entity");
let HelpModule = class HelpModule {
};
exports.HelpModule = HelpModule;
exports.HelpModule = HelpModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([help_entity_1.Help])],
        controllers: [help_controller_1.HelpController],
        providers: [help_service_1.HelpService, help_support_gateway_1.HelpSupportGateway],
        exports: [help_service_1.HelpService],
    })
], HelpModule);
//# sourceMappingURL=help.module.js.map