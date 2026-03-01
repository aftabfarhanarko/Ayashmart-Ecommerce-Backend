import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
  IsBoolean,
  IsArray,
} from "class-validator";
import { PromocodeDiscountType } from "../entities/promocode.entity";

export class CreatePromocodeDto {
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(PromocodeDiscountType)
    discountType: PromocodeDiscountType;

    @IsNumber()
    discountValue: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxUses?: number;

    @IsOptional()
    @IsNumber()
    minOrderAmount?: number;

    @IsOptional()
    @IsDateString()
    startsAt?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    companyId?: string;

    // Optional list of product IDs the promocode applies to
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    productIds?: number[];
}