import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsDateString } from "class-validator";
import { Type } from "class-transformer";
import { ProductImageDto } from "./product-image.dto";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  price: number;

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

  @IsOptional()
  @IsNumber()
  sold?: number;

  @IsOptional()
  @IsNumber()
  totalIncome?: number;

  @IsOptional()
  @IsBoolean()
  isLowStock?: boolean;

  // Size variants (e.g. ["S", "M", "L"])
  @IsOptional()
  @IsArray()
  sizes?: (string | number)[];

  // Product variants (e.g. [{ name: "Red" }, { name: "Blue" }])
  @IsOptional()
  @IsArray()
  variants?: { name: string }[];
 

  // Shipping dimensions
  @IsOptional()
  @IsNumber()
  weight?: number; // kg

  @IsOptional()
  @IsNumber()
  length?: number; // inches

  @IsOptional()
  @IsNumber()
  breadth?: number; // inches

  @IsOptional()
  @IsNumber()
  width?: number; // inches

  @IsOptional()
  @IsString()
  unit?: string;
}
