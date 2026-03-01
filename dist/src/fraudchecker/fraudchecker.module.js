"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudcheckerModule = void 0;
const common_1 = require("@nestjs/common");
const fraudchecker_service_1 = require("./fraudchecker.service");
const fraudchecker_controller_1 = require("./fraudchecker.controller");
const users_module_1 = require("../users/users.module");
const request_context_service_1 = require("../common/services/request-context.service");
let FraudcheckerModule = class FraudcheckerModule {
};
exports.FraudcheckerModule = FraudcheckerModule;
exports.FraudcheckerModule = FraudcheckerModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule],
        controllers: [fraudchecker_controller_1.FraudcheckerController],
        providers: [fraudchecker_service_1.FraudcheckerService, request_context_service_1.RequestContextService],
    })
], FraudcheckerModule);
//# sourceMappingURL=fraudchecker.module.js.map