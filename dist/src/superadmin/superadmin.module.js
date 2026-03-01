"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperadminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const superadmin_entity_1 = require("./entities/superadmin.entity");
const superadmin_controller_1 = require("./superadmin.controller");
const superadmin_service_1 = require("./superadmin.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const wildcard_domain_service_1 = require("../common/services/wildcard-domain.service");
const wildcard_bootstrap_service_1 = require("../common/services/wildcard-bootstrap.service");
let SuperadminModule = class SuperadminModule {
};
exports.SuperadminModule = SuperadminModule;
exports.SuperadminModule = SuperadminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([superadmin_entity_1.SuperAdmin]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'change-me-in-prod',
                signOptions: { expiresIn: '24d' },
            }),
        ],
        controllers: [superadmin_controller_1.SuperadminController],
        providers: [superadmin_service_1.SuperadminService, wildcard_domain_service_1.WildcardDomainService, wildcard_bootstrap_service_1.WildcardBootstrapService],
        exports: [superadmin_service_1.SuperadminService, jwt_1.JwtModule, passport_1.PassportModule, wildcard_domain_service_1.WildcardDomainService],
    })
], SuperadminModule);
//# sourceMappingURL=superadmin.module.js.map