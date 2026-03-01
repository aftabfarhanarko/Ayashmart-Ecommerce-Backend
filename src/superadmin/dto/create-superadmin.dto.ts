import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';
import { FeaturePermission } from '../../systemuser/feature-permission.enum';

export class CreateSuperadminDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsArray()
  permissions?: FeaturePermission[];
}
