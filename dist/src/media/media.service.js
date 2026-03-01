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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_entity_1 = require("./entities/media.entity");
const fs = require("fs");
const path = require("path");
let MediaService = class MediaService {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }
    async create(createMediaDto, companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const media = this.mediaRepository.create({
            ...createMediaDto,
            companyId,
        });
        return this.mediaRepository.save(media);
    }
    async uploadFile(file, companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Allowed: JPG, PNG, WEBP, GIF');
        }
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size must be less than 20MB');
        }
        const ext = path.extname(file.originalname) || '.jpg';
        const type = ext.toUpperCase().replace('.', '');
        const size = this.formatFileSize(file.size);
        const title = path.basename(file.originalname, ext) || `image_${Date.now()}`;
        const media = this.mediaRepository.create({
            title,
            type,
            size,
            url: `/uploads/media/${file.filename}`,
            companyId,
            filename: file.filename,
        });
        return this.mediaRepository.save(media);
    }
    async findAll(companyId, options) {
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const page = options?.page ?? 1;
        const limit = Math.min(options?.limit ?? 24, 100);
        const skip = (page - 1) * limit;
        const queryBuilder = this.mediaRepository
            .createQueryBuilder('media')
            .where('media.companyId = :companyId', { companyId });
        if (options?.search?.trim()) {
            queryBuilder.andWhere('(media.title ILIKE :search OR media.type ILIKE :search)', { search: `%${options.search.trim()}%` });
        }
        const sortBy = options?.sortBy ?? 'newest';
        switch (sortBy) {
            case 'name':
                queryBuilder.orderBy('media.title', 'ASC');
                break;
            case 'size':
                queryBuilder.orderBy('media.size', 'DESC');
                break;
            case 'date':
                queryBuilder.orderBy('media.createdAt', 'ASC');
                break;
            default:
                queryBuilder.orderBy('media.createdAt', 'DESC');
        }
        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return { data, total, page, totalPages };
    }
    async findOne(id, companyId) {
        return this.mediaRepository.findOne({
            where: { id, companyId },
        });
    }
    async update(id, updateMediaDto, companyId) {
        const media = await this.findOne(id, companyId);
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        Object.assign(media, updateMediaDto);
        return this.mediaRepository.save(media);
    }
    async remove(id, companyId) {
        const media = await this.findOne(id, companyId);
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        if (media.filename) {
            const uploadsDir = path.join(process.cwd(), 'uploads', 'media');
            const filePath = path.join(uploadsDir, media.filename);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            catch (err) {
                console.warn('Failed to delete file from disk:', err);
            }
        }
        await this.mediaRepository.delete(id);
    }
    formatFileSize(bytes) {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.MediaEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MediaService);
//# sourceMappingURL=media.service.js.map