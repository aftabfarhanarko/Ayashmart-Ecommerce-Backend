import { User } from '../../users/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';
export declare class Cartproduct {
    id: number;
    user: User;
    sessionId: string;
    product: ProductEntity;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
