import { IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class BulkUploadProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  images?: string; // Comma-separated image URLs
}
