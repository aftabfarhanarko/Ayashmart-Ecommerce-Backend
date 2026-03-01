import { IsString, IsEmail } from 'class-validator';

export class SuperadminLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
