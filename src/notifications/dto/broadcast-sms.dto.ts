import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BroadcastSmsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(480, { message: 'SMS message should not exceed 480 characters' })
  message: string;
}

