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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, productRepository, userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    async create(createReviewDto, companyId, userId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const product = await this.productRepository.findOne({
            where: { id: createReviewDto.productId, companyId, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        let user;
        const effectiveUserId = createReviewDto.userId ?? userId;
        if (effectiveUserId) {
            const foundUser = await this.userRepository.findOne({
                where: { id: effectiveUserId, companyId },
            });
            user = foundUser || undefined;
        }
        const review = this.reviewRepository.create({
            rating: createReviewDto.rating,
            title: createReviewDto.title,
            comment: createReviewDto.comment,
            product,
            user,
            companyId,
        });
        return this.reviewRepository.save(review);
    }
    async findByUser(userId, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        return this.reviewRepository.find({
            where: { user: { id: userId }, companyId, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['product', 'user'],
            order: { id: 'DESC' },
        });
    }
    async findAll(companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        return this.reviewRepository.find({
            where: { companyId, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['product', 'user'],
            order: { id: 'DESC' },
        });
    }
    async findByProduct(productId, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const product = await this.productRepository.findOne({
            where: { id: productId, companyId, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.reviewRepository.find({
            where: { product: { id: productId }, companyId, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['product', 'user'],
            order: { id: 'DESC' },
        });
    }
    async findOne(id, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const review = await this.reviewRepository.findOne({
            where: { id, companyId, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['product', 'user'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async update(id, updateReviewDto, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const review = await this.findOne(id, companyId);
        if (updateReviewDto.productId) {
            const product = await this.productRepository.findOne({
                where: { id: updateReviewDto.productId, companyId, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            review.product = product;
        }
        if (updateReviewDto.rating !== undefined)
            review.rating = updateReviewDto.rating;
        if (updateReviewDto.title !== undefined)
            review.title = updateReviewDto.title;
        if (updateReviewDto.comment !== undefined)
            review.comment = updateReviewDto.comment;
        if (updateReviewDto.reply !== undefined)
            review.reply = updateReviewDto.reply;
        return this.reviewRepository.save(review);
    }
    async remove(id, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const review = await this.findOne(id, companyId);
        await this.reviewRepository.softRemove(review);
        return { success: true };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map