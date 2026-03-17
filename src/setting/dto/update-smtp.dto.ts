import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSmtpDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  smtpUser?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  smtpPass?: string;
}

