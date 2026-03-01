import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateTopProductsSectionDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  leftImageUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  rightImageUrl?: string;
}

