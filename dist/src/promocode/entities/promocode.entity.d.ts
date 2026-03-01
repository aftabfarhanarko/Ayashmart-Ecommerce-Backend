export declare enum PromocodeDiscountType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare class PromocodeEntity {
    id: number;
    code: string;
    description?: string;
    discountType: PromocodeDiscountType;
    discountValue: number;
    maxUses?: number;
    currentUses: number;
    minOrderAmount?: number;
    startsAt?: Date;
    expiresAt?: Date;
    isActive: boolean;
    productIds?: number[];
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
