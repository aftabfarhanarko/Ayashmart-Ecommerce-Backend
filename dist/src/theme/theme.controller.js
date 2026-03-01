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
exports.ThemeController = void 0;
const common_1 = require("@nestjs/common");
const theme_service_1 = require("./theme.service");
const create_theme_dto_1 = require("./dto/create-theme.dto");
const update_theme_dto_1 = require("./dto/update-theme.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
let ThemeController = class ThemeController {
    constructor(themeService) {
        this.themeService = themeService;
    }
    async create(createThemeDto) {
        const theme = await this.themeService.create(createThemeDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Theme created successfully',
            data: theme,
        };
    }
    async findAll() {
        const themes = await this.themeService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Themes retrieved successfully',
            data: themes,
        };
    }
    async findOne(id) {
        const theme = await this.themeService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Theme retrieved successfully',
            data: theme,
        };
    }
    async update(id, updateThemeDto) {
        const theme = await this.themeService.update(+id, updateThemeDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Theme updated successfully',
            data: theme,
        };
    }
    async remove(id) {
        await this.themeService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Theme deleted successfully',
        };
    }
};
exports.ThemeController = ThemeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_theme_dto_1.CreateThemeDto]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_theme_dto_1.UpdateThemeDto]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "remove", null);
exports.ThemeController = ThemeController = __decorate([
    (0, common_1.Controller)('theme'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [theme_service_1.ThemeService])
], ThemeController);
//# sourceMappingURL=theme.controller.js.map