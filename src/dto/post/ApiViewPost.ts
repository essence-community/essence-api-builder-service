import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class ApiViewPost {
    @ApiProperty({
        required: true,
        maxLength: 255,
    })
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        required: false,
    })
    description?: string;
}
