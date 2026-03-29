import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFraudCheckerDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fraudCheckerApiKey?: string;
}
