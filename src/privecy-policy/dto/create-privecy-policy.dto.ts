import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivecyPolicyDto {
    @ApiProperty({
        description: 'The content of the privacy policy',
        example: 'This privacy policy outlines how we collect, use, and protect your personal information...',
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
