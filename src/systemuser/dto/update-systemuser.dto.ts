import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsObject, IsString } from 'class-validator';
import { CreateSystemuserDto } from './create-systemuser.dto';

export class PathaoConfigDto {
  @IsOptional()
  @IsString()
  clientId?: string;
  @IsOptional()
  @IsString()
  clientSecret?: string;
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsString()
  password?: string;
}

export class SteadfastConfigDto {
  @IsOptional()
  @IsString()
  apiKey?: string;
  @IsOptional()
  @IsString()
  secretKey?: string;
}

export class RedxConfigDto {
  @IsOptional()
  @IsString()
  token?: string;
  @IsOptional()
  @IsBoolean()
  sandbox?: boolean;
}

export class NotificationConfigDto {
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  whatsapp?: string;
}

export class UpdateSystemuserDto extends PartialType(CreateSystemuserDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  pathaoConfig?: PathaoConfigDto;

  @IsOptional()
  @IsObject()
  steadfastConfig?: SteadfastConfigDto;

  @IsOptional()
  @IsObject()
  redxConfig?: RedxConfigDto;

  @IsOptional()
  @IsObject()
  notificationConfig?: NotificationConfigDto;
}
