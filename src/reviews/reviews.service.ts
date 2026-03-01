import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createReviewDto: CreateReviewDto, companyId: string, userId?: number) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const product = await this.productRepository.findOne({
      where: { id: createReviewDto.productId, companyId, deletedAt: IsNull() },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let user: User | undefined;
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

  async findByUser(userId: number, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    return this.reviewRepository.find({
      where: { user: { id: userId }, companyId, deletedAt: IsNull() },
      relations: ['product', 'user'],
      order: { id: 'DESC' },
    });
  }

  async findAll(companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    return this.reviewRepository.find({
      where: { companyId, deletedAt: IsNull() },
      relations: ['product', 'user'],
      order: { id: 'DESC' },
    });
  }

  async findByProduct(productId: number, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const product = await this.productRepository.findOne({
      where: { id: productId, companyId, deletedAt: IsNull() },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.reviewRepository.find({
      where: { product: { id: productId }, companyId, deletedAt: IsNull() },
      relations: ['product', 'user'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const review = await this.reviewRepository.findOne({
      where: { id, companyId, deletedAt: IsNull() },
      relations: ['product', 'user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const review = await this.findOne(id, companyId);

    if (updateReviewDto.productId) {
      const product = await this.productRepository.findOne({
        where: { id: updateReviewDto.productId, companyId, deletedAt: IsNull() },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      review.product = product;
    }

    if (updateReviewDto.rating !== undefined) review.rating = updateReviewDto.rating;
    if (updateReviewDto.title !== undefined) review.title = updateReviewDto.title;
    if (updateReviewDto.comment !== undefined) review.comment = updateReviewDto.comment;
    if (updateReviewDto.reply !== undefined) review.reply = updateReviewDto.reply;

    return this.reviewRepository.save(review);
  }

  async remove(id: number, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const review = await this.findOne(id, companyId);
    await this.reviewRepository.softRemove(review);
    return { success: true };
  }
}
