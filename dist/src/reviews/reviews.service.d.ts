import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
export declare class ReviewsService {
    private readonly reviewRepository;
    private readonly productRepository;
    private readonly userRepository;
    constructor(reviewRepository: Repository<Review>, productRepository: Repository<ProductEntity>, userRepository: Repository<User>);
    create(createReviewDto: CreateReviewDto, companyId: string, userId?: number): Promise<Review>;
    findByUser(userId: number, companyId: string): Promise<Review[]>;
    findAll(companyId: string): Promise<Review[]>;
    findByProduct(productId: number, companyId: string): Promise<Review[]>;
    findOne(id: number, companyId: string): Promise<Review>;
    update(id: number, updateReviewDto: UpdateReviewDto, companyId: string): Promise<Review>;
    remove(id: number, companyId: string): Promise<{
        success: boolean;
    }>;
}
