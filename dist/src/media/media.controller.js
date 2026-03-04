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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const media_service_1 = require("./media.service");
const multer_media_config_1 = require("../common/config/multer-media.config");
const create_media_dto_1 = require("./dto/create-media.dto");
const update_media_dto_1 = require("./dto/update-media.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async upload(file, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const media = await this.mediaService.uploadFile(file, companyId);
        const baseUrl = 'https://e-cdn.vercel.app';
        const fullUrl = media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`;
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Media uploaded successfully',
            success: true,
            data: { ...media, url: fullUrl },
            url: fullUrl,
        };
    }
    async create(createMediaDto, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const media = await this.mediaService.create(createMediaDto, companyId);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Media created successfully',
            data: media,
        };
    }
    async findAll(companyIdFromQuery, companyIdFromToken, search, sortBy, page, limit) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const result = await this.mediaService.findAll(companyId, {
            search,
            sortBy,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 24,
        });
        const baseUrl = process.env.CDN_BASE_URL ||
            process.env.API_BASE_URL ||
            'http://localhost:8000';
        const data = result.data.map((m) => ({
            ...m,
            url: m.url.startsWith('http') ? m.url : `${baseUrl}${m.url}`,
            date: m.createdAt?.toISOString().split('T')[0] || '',
        }));
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Media list fetched successfully',
            data,
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        };
    }
    async findOne(id, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const media = await this.mediaService.findOne(id, companyId);
        if (!media) {
            return { statusCode: common_1.HttpStatus.NOT_FOUND, message: 'Media not found' };
        }
        const baseUrl = process.env.CDN_BASE_URL ||
            process.env.API_BASE_URL ||
            'http://localhost:8000';
        const url = media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`;
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Media fetched successfully',
            data: { ...media, url, date: media.createdAt?.toISOString().split('T')[0] || '' },
        };
    }
    async update(id, updateMediaDto, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const media = await this.mediaService.update(id, updateMediaDto, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Media updated successfully',
            data: media,
        };
    }
    async remove(id, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        await this.mediaService.remove(id, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Media deleted successfully',
        };
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multer_media_config_1.mediaMulterConfig)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_dto_1.CreateMediaDto, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('companyId')),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_media_dto_1.UpdateMediaDto, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "remove", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map