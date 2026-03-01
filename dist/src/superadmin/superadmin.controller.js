"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperadminController = void 0;
const common_1 = require("@nestjs/common");
const superadmin_service_1 = require("./superadmin.service");
const create_superadmin_dto_1 = require("./dto/create-superadmin.dto");
const login_dto_1 = require("./dto/login.dto");
const wildcard_domain_service_1 = require("../common/services/wildcard-domain.service");
let SuperadminController = class SuperadminController {
    constructor(superadminService, wildcardDomainService) {
        this.superadminService = superadminService;
        this.wildcardDomainService = wildcardDomainService;
    }
    login(dto) {
        return this.superadminService.login(dto);
    }
    async setupWildcard() {
        const result = await this.wildcardDomainService.setupWildcard();
        return result;
    }
    create(createSuperadminDto, req) {
        return this.superadminService.create(createSuperadminDto);
    }
    findAll(req) {
        return this.superadminService.findAll();
    }
    findOne(id, req) {
        return this.superadminService.findOne(+id);
    }
    update(id, updateSuperadminDto, req) {
        return this.superadminService.update(+id, updateSuperadminDto);
    }
    remove(id, req) {
        return this.superadminService.remove(+id);
    }
};
exports.SuperadminController = SuperadminController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.SuperadminLoginDto]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('wildcard/setup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "setupWildcard", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_superadmin_dto_1.CreateSuperadminDto, Object]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "remove", null);
exports.SuperadminController = SuperadminController = __decorate([
    (0, common_1.Controller)('superadmin'),
    __metadata("design:paramtypes", [superadmin_service_1.SuperadminService,
        wildcard_domain_service_1.WildcardDomainService])
], SuperadminController);
//# sourceMappingURL=superadmin.controller.js.map