import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Pairs } from '../../types/Pairs';

export class ApiFieldPut {
    @ApiProperty({
        required: true,
        format: 'uuid'
    })
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    contactName: string;

    @ApiProperty({
        required: false,
    })
    contactEmail?: string;

    @ApiProperty({
        required: false,
    })
    infoUrl?: string;

    @ApiProperty({
        required: false,
    })
    infoDescription?: string;

    @ApiProperty({
        required: false,
        type: 'array',
        items: {
            type: 'object',
            required: ['in', 'out'],
            properties: {
                in: {
                    type: 'string',
                },
                out: {
                    type: 'string',
                }
            }
        }
    })
    extraField: Pairs[] = [];

    @ApiProperty({
        required: true,
        format: 'uuid'
    })
    @IsNotEmpty()
    @IsUUID()
    idApiView: string;
}
