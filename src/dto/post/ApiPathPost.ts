import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, ValidateBy } from 'class-validator';
import { Pairs } from '../../types/Pairs';
import { isEmpty } from '../../utils/Base';

const RE_PATH = /^([0-9A-zА-я]*(?!__)(?!\/\/)[_\/]*[0-9A-zА-я]*)*$/gi;

export class ApiPathPost {
    @ApiProperty({
        required: true,
        pattern: '^([0-9A-zА-я]*(?!__)(?!\/\/)[_\/]*[0-9A-zА-я]*)*$',
    })
    @IsNotEmpty()
    @ValidateBy({
        name: 'Check path',
        validator: (value) => {
            return !isEmpty(value) && RE_PATH.test(value);
        }
    })
    path: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    objectId: string;

    @ApiProperty({
        required: false,
    })
    description?: string;

    @ApiProperty({
        required: false,
    })
    schema?: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    table: string;

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
    globalValue?: Pairs[] = [];

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
    master?: Pairs[] = [];

    @ApiProperty({
        required: true,
        format: 'uuid'
    })
    @IsNotEmpty()
    @IsUUID()
    idApiView: string;
}
