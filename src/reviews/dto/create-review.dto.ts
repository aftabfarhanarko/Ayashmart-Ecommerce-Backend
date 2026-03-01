import { IsInt, Max, Min, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsInt()
  userId?: number;
}
