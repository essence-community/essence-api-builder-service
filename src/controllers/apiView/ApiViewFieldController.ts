import { ApiViewField } from '../../services/ApiViewField';
import { Controller, Get, Req, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Result } from '../../dto/Result';
import { ApiFieldPost } from '../../dto/post/ApiFieldPost';
import { ApiFieldPut } from '../../dto/put/ApiFieldPut';

@Controller('api-view/field')
@ApiTags('api')
export class ApiViewFieldController {
    constructor(private readonly provider: ApiViewField) {}
    @Get()
    @ApiOkResponse({
        schema: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'idApiView', 'contactName', 'create', 'change', 'user', 'total'],
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    idApiView: {
                        type: 'string',
                        format: 'uuid',
                    },
                    contactName: {
                        type: 'string',
                    },
                    contactEmail: {
                        type: 'string',
                    },
                    infoUrl: {
                        type: 'string',
                    },
                    infoDescription: {
                        type: 'string',
                    },
                    extraField: {
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
        type: ApiFieldPost,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPost(
        @Req() request: Request, 
        @Body() body: ApiFieldPost): Promise<Result> {
        return this.provider.add(body, (request as any).user?.ck_id);
    }

    @Put()
    @ApiBody({
        type: ApiFieldPut,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPut(
        @Req() request: Request, 
        @Body() body: ApiFieldPut): Promise<Result> {
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
