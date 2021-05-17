import { Controller, Get, Req, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags, ApiProduces } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ApiViewGenerate } from '../../services/ApiViewGenerate';

@Controller('api-view/generate')
@ApiTags('api')
export class ApiViewGenerateController {
    constructor(private readonly provider: ApiViewGenerate) {}
    @Get()
    @ApiQuery({ name: 'id', required: true, schema: { type: 'string', format: 'uuid' } })
    @ApiProduces('application/zip')
    @ApiOkResponse({
        schema: {
            type: 'string',
            format: 'binary',
        }
    })
    async apiViewGet(@Req() request: Request, @Res() response: Response, @Query('id') idApiView: string): Promise<void> {
        const file = await this.provider.generate(idApiView);
        response.setHeader('Content-Disposition', `attachment; filename="${encodeURI(
            file.name+'.zip',
        )}"`);
        response.setHeader('Content-Length', file.file.length);
        response.setHeader('Content-Type', 'application/zip');
        response.end(file.file);
        return;
    }
}
