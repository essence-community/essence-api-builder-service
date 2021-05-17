import { ApiViewPath } from '../../../services/ApiViewPath';
import { Controller, Get, Req, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Result } from '../../../dto/Result';
import { ApiPathPost } from '../../../dto/post/ApiPathPost';
import { ApiPathPut } from '../../../dto/put/ApiPathPut';

@Controller('api-view/path')
@ApiTags('api')
export class ApiViewPathController {
    constructor(private readonly provider: ApiViewPath) {}
    @Get()
    @ApiOkResponse({
        schema: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'idApiView', 'path', 'objectId', 'table', 'create', 'change', 'user', 'total'],
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    idApiView: {
                        type: 'string',
                        format: 'uuid',
                    },
                    path: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    objectId: {
                        type: 'string',
                    },
                    schema: {
                        type: 'string',
                    },
                    table: {
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
                    },
                    globalValue: {
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
                    },
                    master: {
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
        type: ApiPathPost,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPost(
        @Req() request: Request, 
        @Body() body: ApiPathPost): Promise<Result> {
        return this.provider.add(body, (request as any).user?.ck_id);
    }

    @Put()
    @ApiBody({
        type: ApiPathPut,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPut(
        @Req() request: Request, 
        @Body() body: ApiPathPut): Promise<Result> {
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
