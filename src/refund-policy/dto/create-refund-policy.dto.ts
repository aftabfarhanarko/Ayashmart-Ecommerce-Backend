import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRefundPolicyDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}
