import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsDateString } from "class-validator";
import { Type } from "class-transformer";
import { ProductImageDto } from "./product-image.dto";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  status?: 'draft' | 'published' | 'trashed' | 'pending';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  isFlashSell?: boolean;

  @IsOptional()
  @IsDateString()
  flashSellStartTime?: string;

  @IsOptional()
  @IsDateString()
  flashSellEndTime?: string;

  @IsOptional()
  @IsNumber()
  flashSellPrice?: number;

  // Inventory fields
  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  newStock?: number;

  // Inventory adjustment meta (for history)
  @IsOptional()
  @IsNumber()
  adjustment?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsNumber()
  sold?: number;

  @IsOptional()
  @IsNumber()
  totalIncome?: number;

  @IsOptional()
  @IsBoolean()
  isLowStock?: boolean;

  // Size variants
  @IsOptional()
  @IsArray()
  sizes?: (string | number)[];

  // Product variants
  @IsOptional()
  @IsArray()
  variants?: { name: string }[];

  // Shipping dimensions
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  breadth?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}
