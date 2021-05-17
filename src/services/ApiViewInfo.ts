import { Injectable } from '@nestjs/common';
import { Result } from '../dto/Result';
import { Connection } from 'typeorm';
import { ApiInfo } from '../entities/ApiInfo';
import { ApiView } from '../entities/ApiView';

@Injectable()
export class ApiViewInfo {
    constructor(private connection: Connection) {}
    
    async findAll(idView: string, offset = '0', fetch = '2000', id?: string): Promise<[ApiInfo[], number]> {
        return this.connection.getRepository(ApiInfo).findAndCount({
            where: {apiView: { id: idView }, ...(id? {id} : {})},
            relations: ['apiView'],
            take: parseInt(fetch, 10),
            skip: parseInt(offset, 10),
        });
    }
    async add(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        obj.apiView = await this.connection.getRepository(ApiView).findOne(obj.idApiView);
        const res = await this.connection.getRepository(ApiInfo).save(obj as ApiInfo);
        return {
            id: res.id
        }
    }

    async update(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        obj.apiView = await this.connection.getRepository(ApiView).findOne(obj.idApiView);
        const res = await this.connection.getRepository(ApiInfo).save(obj as ApiInfo);
        return {
            id: res.id
        }
    }

    async delete(id: string): Promise<Result> {
        await this.connection.getRepository(ApiInfo).delete(id);
        return {
            id
        }
    }
}
