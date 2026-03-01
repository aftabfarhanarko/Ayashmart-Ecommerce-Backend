import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, companyId: string, userId: number): Promise<import("./entities/review.entity").Review>;
    findMyReviews(userId: number, companyId: string): Promise<import("./entities/review.entity").Review[]>;
    findAll(companyId: string): Promise<import("./entities/review.entity").Review[]>;
    findByProduct(productId: number, companyId: string): Promise<import("./entities/review.entity").Review[]>;
    findOne(id: number, companyId: string): Promise<import("./entities/review.entity").Review>;
    update(id: number, updateReviewDto: UpdateReviewDto, companyId: string): Promise<import("./entities/review.entity").Review>;
    reply(id: number, replyDto: ReplyReviewDto, companyId: string): Promise<import("./entities/review.entity").Review>;
    remove(id: number, companyId: string): Promise<{
        success: boolean;
    }>;
}
