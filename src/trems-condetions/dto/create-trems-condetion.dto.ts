import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTremsCondetionDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}
