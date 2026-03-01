import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { FeaturePermission } from '../../systemuser/feature-permission.enum';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  discountPrice?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(FeaturePermission, { each: true })
  features?: FeaturePermission[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  themeId?: number;
}
