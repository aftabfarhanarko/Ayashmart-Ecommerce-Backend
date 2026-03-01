import { Order } from '../../orders/entities/order.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    district?: string;
    address?: string;
    isActive: boolean;
    role: 'customer' | 'admin';
    orders: Order[];
    successfulOrdersCount: number;
    cancelledOrdersCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isBanned: boolean;
    banReason?: string | null;
    bannedAt?: Date | null;
    companyId: string;
    passwordHash?: string;
    passwordSalt?: string;
}
