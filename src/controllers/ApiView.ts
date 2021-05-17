import { ApiViewService } from '../services/ApiViewService';
import { Controller, Get, Req, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Result } from '../dto/Result';
import { ApiViewPost } from '../dto/post/ApiViewPost';
import { ApiViewPut } from '../dto/put/ApiViewPut';

@Controller('api-view')
@ApiTags('api')
export class ApiView {
    constructor(private readonly apiViewService: ApiViewService) {}
    @Get()
    @ApiOkResponse({
        schema: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'create', 'change', 'user', 'total'],
                properties: {
                    id: {
                        type: 'string',
                    },
                    name: {
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
    @ApiQuery({ name: 'id', required: false })
    async apiViewGet(@Req() request: Request): Promise<any[]> {
        const [result, total] = await this.apiViewService.findAll(request.query.offset as string, request.query.fetch as string, request.query.id as string);

        return result.map((res) => ({
            ...res,
            total,
        }));
    }

    @Post()
    @ApiBody({
        type: ApiViewPost,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPost(
        @Req() request: Request, 
        @Body() body: ApiViewPost): Promise<Result> {
        return this.apiViewService.add(body, (request as any).user?.ck_id);
    }

    @Put()
    @ApiBody({
        type: ApiViewPut,
    })
    @ApiOkResponse({
        type: Result
    })
    async apiViewPut(
        @Req() request: Request, 
        @Body() body: ApiViewPut): Promise<Result> {
        return this.apiViewService.update(body, (request as any).user?.ck_id);
    }

    @Delete()
    @ApiQuery({ name: 'id', required: true })
    @ApiOkResponse({
        type: Result
    })
    async apiViewDelete(
        @Query('id') id: string): Promise<Result> {
        return this.apiViewService.delete(id);
    }
}
