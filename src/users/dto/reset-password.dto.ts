import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}

