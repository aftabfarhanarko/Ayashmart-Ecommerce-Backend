import { HttpStatus } from '@nestjs/common';
import { CartproductsService } from './cartproducts.service';
import { CreateCartproductDto } from './dto/create-cartproduct.dto';
import { UpdateCartproductDto } from './dto/update-cartproduct.dto';
export declare class CartproductsController {
    private readonly cartproductsService;
    constructor(cartproductsService: CartproductsService);
    create(createCartproductDto: CreateCartproductDto, companyId?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/cartproduct.entity").Cartproduct;
    }>;
    findByUser(userId: number, companyId?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/cartproduct.entity").Cartproduct[];
    }>;
    clearUserCart(userId: number, companyId?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            affected: number;
        };
    }>;
    removeOne(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    updateOne(id: number, dto: UpdateCartproductDto, companyId?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/cartproduct.entity").Cartproduct;
    }>;
    orderFromCart(userId: number, payload?: {
        paymentMethod?: 'DIRECT' | 'COD';
        pickupPoint?: any;
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            order: import("../orders/entities/order.entity").Order;
            payment: any;
        };
    }>;
}
