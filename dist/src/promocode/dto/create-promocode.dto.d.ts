import { PromocodeDiscountType } from "../entities/promocode.entity";
export declare class CreatePromocodeDto {
    code: string;
    description?: string;
    discountType: PromocodeDiscountType;
    discountValue: number;
    maxUses?: number;
    minOrderAmount?: number;
    startsAt?: string;
    expiresAt?: string;
    isActive?: boolean;
    companyId?: string;
    productIds?: number[];
}
