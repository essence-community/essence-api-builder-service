import { ApiViewInfo } from '../../services/ApiViewInfo';
import { Controller, Get, Req, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Result } from '../../dto/Result';
import { ApiInfoPost } from '../../dto/post/ApiInfoPost';
import { ApiInfoPut } from '../../dto/put/ApiInfoPut';

@Controller('api-view/info')
@ApiTags('api')
export class ApiViewInfoController {
    constructor(private readonly provider: ApiViewInfo) {}
    @Get()
    @ApiOkResponse({
        schema: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'idApiView', 'name', 'version', 'create', 'change', 'user', 'total'],
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    idApiView: {
                        type: 'string',
                        format: 'uuid',
                    },
                    name: {
                        type: 'string',
                    },
                    version: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    create: {
                        type: 'string',
                        format: 'date-time'
                    },
                    change: {
                        type: 'string',
                        format: 'date-time'
                    },
                    user: {
                        type: 'string',
                    },
                    total: {
                        type: 'number',
                    }
                }
            }
        }
    })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'fetch', required: false })
    @ApiQuery({ name: 'idApiView', required: true })
    @ApiQuery({ name: 'id', required: false })
    async apiViewGet(@Req() request: Request, @Query('idApiView') idApiView: string): Promise<any[]> {
        const [result, total] = await this.provider.findAll(idApiView, request.query.offset as string, request.query.fetch as string, request.query.id as string);

        return result.map((res) => ({
            ...res,
            idApiView: res.apiView.id,
            apiView: undefined,
            total,
        }));
    }

    @Post()
    @ApiBody({
        type: ApiInfoPost,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPost(
        @Req() request: Request, 
        @Body() body: ApiInfoPost): Promise<Result> {
        return this.provider.add(body, (request as any).user?.ck_id);
    }

    @Put()
    @ApiBody({
        type: ApiInfoPut,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPut(
        @Req() request: Request, 
        @Body() body: ApiInfoPut): Promise<Result> {
        return this.provider.update(body, (request as any).user?.ck_id);
    }

    @Delete()
    @ApiQuery({ name: 'id', required: true })
    @ApiOkResponse({
        type: Result
    })
    async apiViewDelete(
        @Query('id') id: string): Promise<Result> {
        return this.provider.delete(id);
    }
}
