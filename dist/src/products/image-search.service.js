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
exports.ImageSearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const config_1 = require("@nestjs/config");
let ImageSearchService = class ImageSearchService {
    constructor(productRepository, configService) {
        this.productRepository = productRepository;
        this.configService = configService;
        this.visionClient = null;
        this.initVisionClient();
    }
    initVisionClient() {
        const credentialsPath = this.configService.get('GOOGLE_APPLICATION_CREDENTIALS');
        if (credentialsPath || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            try {
                const vision = require('@google-cloud/vision');
                this.visionClient = new vision.ImageAnnotatorClient();
            }
            catch {
                this.visionClient = null;
            }
        }
    }
    async extractLabelsFromImage(imageBuffer, filename) {
        if (this.visionClient) {
            try {
                const [result] = await this.visionClient.labelDetection({
                    image: { content: imageBuffer },
                });
                const labels = result.labelAnnotations || [];
                return labels
                    .filter((l) => l.score && l.score >= 0.5)
                    .map((l) => l.description?.toLowerCase())
                    .filter(Boolean);
            }
            catch (err) {
                console.warn('Vision API failed, falling back to filename:', err?.message);
            }
        }
        if (filename) {
            const baseName = filename.replace(/\.[^/.]+$/, '');
            return baseName
                .toLowerCase()
                .split(/[-_\s]+/)
                .filter((w) => w.length > 2);
        }
        return [];
    }
    computeSimilarity(imageLabels, product) {
        const categoryName = product.category && typeof product.category === 'object' && 'name' in product.category
            ? product.category.name
            : '';
        const productText = [product.name, product.description || '', categoryName]
            .join(' ')
            .toLowerCase();
        const productTokens = new Set(productText
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 2));
        if (imageLabels.length === 0) {
            return 0;
        }
        let matches = 0;
        for (const label of imageLabels) {
            if (productTokens.has(label)) {
                matches++;
                continue;
            }
            for (const token of productTokens) {
                if (token.includes(label) || label.includes(token)) {
                    matches++;
                    break;
                }
            }
        }
        const score = (matches / imageLabels.length) * 100;
        return Math.min(100, Math.round(score * 10) / 10);
    }
    async searchByImage(imageBuffer, companyId, filename) {
        if (!imageBuffer || imageBuffer.length === 0) {
            throw new common_1.BadRequestException('Image buffer is required');
        }
        const imageLabels = await this.extractLabelsFromImage(imageBuffer, filename);
        const products = await this.productRepository.find({
            where: {
                companyId,
                deletedAt: (0, typeorm_2.IsNull)(),
                status: 'published',
                isActive: true,
            },
            relations: ['category'],
        });
        const scored = products
            .map((product) => ({
            product,
            matchScore: this.computeSimilarity(imageLabels, product),
        }))
            .filter((s) => s.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore);
        const match40 = scored.filter((s) => s.matchScore >= 40);
        const match60 = scored.filter((s) => s.matchScore >= 60);
        return {
            match40,
            match60,
            imageLabels,
        };
    }
};
exports.ImageSearchService = ImageSearchService;
exports.ImageSearchService = ImageSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ImageSearchService);
//# sourceMappingURL=image-search.service.js.map