import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Result {
    @ApiProperty({
        required: true,
        type: 'string'
    })
    @IsNotEmpty()
    id: string;
}