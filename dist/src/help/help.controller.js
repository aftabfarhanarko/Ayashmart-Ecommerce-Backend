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
exports.HelpController = void 0;
const common_1 = require("@nestjs/common");
const help_service_1 = require("./help.service");
const create_help_dto_1 = require("./dto/create-help.dto");
const update_help_dto_1 = require("./dto/update-help.dto");
const reply_help_dto_1 = require("./dto/reply-help.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
let HelpController = class HelpController {
    constructor(helpService) {
        this.helpService = helpService;
    }
    create(createHelpDto, companyId) {
        return this.helpService.create(createHelpDto, companyId);
    }
    findAll(companyId) {
        return this.helpService.findAll(companyId);
    }
    getStats(companyId) {
        return this.helpService.getStats(companyId);
    }
    findOne(id, companyId) {
        return this.helpService.findOne(id, companyId);
    }
    update(id, updateHelpDto, companyId) {
        return this.helpService.update(id, updateHelpDto, companyId);
    }
    addReply(id, replyDto, companyId) {
        return this.helpService.addReply(id, replyDto, companyId);
    }
    remove(id, companyId) {
        return this.helpService.remove(id, companyId);
    }
};
exports.HelpController = HelpController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_help_dto_1.CreateHelpDto, String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_help_dto_1.UpdateHelpDto, String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reply_help_dto_1.ReplyHelpDto, String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "addReply", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], HelpController.prototype, "remove", null);
exports.HelpController = HelpController = __decorate([
    (0, common_1.Controller)('help'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [help_service_1.HelpService])
], HelpController);
//# sourceMappingURL=help.controller.js.map