import { IsString, MinLength } from 'class-validator';

export class ReplyHelpDto {
  @IsString()
  @MinLength(1, { message: 'Reply message is required' })
  message: string;

  @IsString()
  author: string; // e.g. store owner name or "Support"
}
