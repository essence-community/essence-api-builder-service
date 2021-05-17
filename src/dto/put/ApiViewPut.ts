import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class ApiViewPut {
    @ApiProperty({
        required: true,
        format: 'uuid'
    })
    @IsNotEmpty()
    @IsUUID()
    id: string;

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
