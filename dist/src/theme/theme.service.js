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
exports.ThemeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const theme_entity_1 = require("./entities/theme.entity");
let ThemeService = class ThemeService {
    constructor(themeRepository) {
        this.themeRepository = themeRepository;
    }
    async create(createThemeDto) {
        try {
            const theme = this.themeRepository.create(createThemeDto);
            return await this.themeRepository.save(theme);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create theme', error.message);
        }
    }
    async findAll() {
        try {
            return await this.themeRepository.find({
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve themes', error.message);
        }
    }
    async findOne(id) {
        if (!id || isNaN(id)) {
            throw new common_1.BadRequestException('Invalid theme ID');
        }
        const theme = await this.themeRepository.findOne({ where: { id } });
        if (!theme) {
            throw new common_1.NotFoundException(`Theme with ID ${id} not found`);
        }
        return theme;
    }
    async update(id, updateThemeDto) {
        try {
            const theme = await this.findOne(id);
            Object.assign(theme, updateThemeDto);
            return await this.themeRepository.save(theme);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update theme', error.message);
        }
    }
    async remove(id) {
        try {
            const theme = await this.findOne(id);
            await this.themeRepository.remove(theme);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to delete theme', error.message);
        }
    }
};
exports.ThemeService = ThemeService;
exports.ThemeService = ThemeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(theme_entity_1.Theme)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ThemeService);
//# sourceMappingURL=theme.service.js.map