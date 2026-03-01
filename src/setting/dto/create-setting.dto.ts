import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  @MaxLength(150)
  companyName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logo?: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;
}