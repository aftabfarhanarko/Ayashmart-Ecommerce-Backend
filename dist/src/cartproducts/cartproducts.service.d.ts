import { CreateCartproductDto } from './dto/create-cartproduct.dto';
import { UpdateCartproductDto } from './dto/update-cartproduct.dto';
import { Repository } from 'typeorm';
import { Cartproduct } from './entities/cartproduct.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { OrderService } from '../orders/orders.service';
import { RequestContextService } from '../common/services/request-context.service';
export declare class CartproductsService {
    private readonly cartRepo;
    private readonly productRepo;
    private readonly userRepo;
    private readonly ordersService;
    private readonly requestContextService;
    findUserCart(userId: number, companyId: string): Promise<Cartproduct[]>;
    constructor(cartRepo: Repository<Cartproduct>, productRepo: Repository<ProductEntity>, userRepo: Repository<User>, ordersService: OrderService, requestContextService: RequestContextService);
    create(dto: CreateCartproductDto, companyId: string): Promise<Cartproduct>;
    findAll(userId?: number, companyId?: string): Promise<Cartproduct[]>;
    findOne(id: number): Promise<Cartproduct>;
    update(id: number, dto: UpdateCartproductDto): Promise<Cartproduct>;
    remove(id: number): Promise<void>;
    clearUserCart(userId: number, companyId: string): Promise<{
        affected: number;
    }>;
    orderFromUserCart(userId: number, payload?: {
        paymentMethod?: 'DIRECT' | 'COD';
        pickupPoint?: any;
    }): Promise<{
        order: import("../orders/entities/order.entity").Order;
        payment: any;
    }>;
}
