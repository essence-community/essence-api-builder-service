import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApiInfoPost {
    @ApiProperty({
        required: true,
        maxLength: 255,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: true,
        maxLength: 255,
    })
    @IsNotEmpty()
    version: string;

    @ApiProperty({
        required: false,
    })
    description?: string;

    @ApiProperty({
        required: true,
        format: 'uuid'
    })
    @IsNotEmpty()
    @IsUUID()
    idApiView: string;
}
