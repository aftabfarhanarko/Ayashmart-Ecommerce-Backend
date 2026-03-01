import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyReviewDto {
  @IsString()
  @IsNotEmpty()
  reply: string;
}
