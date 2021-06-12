import { Injectable } from '@nestjs/common';
import { Result } from '../dto/Result';
import { Connection } from 'typeorm';
import { ApiPath } from '../entities/ApiPath';
import { ApiView } from '../entities/ApiView';

@Injectable()
export class ApiViewPath {
    constructor(private connection: Connection) {}
    
    async findAll(idView: string, offset = '0', fetch = '2000', id?: string): Promise<[ApiPath[], number]> {
        return this.connection.getRepository(ApiPath).findAndCount({
            where: {apiView: { id: idView }, ...(id? {id} : {})},
            relations: ['apiView'],
            take: parseInt(fetch, 10),
            skip: parseInt(offset, 10),
        });
    }
    async add(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        obj.apiView = await this.connection.getRepository(ApiView).findOne(obj.idApiView);

        const res = await this.connection.getRepository(ApiPath).save(obj as ApiPath);
        
        return {
            id: res.id
        }
    }

    async update(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        obj.apiView = await this.connection.getRepository(ApiView).findOne(obj.idApiView);
        await this.connection.getRepository(ApiPath).findOneOrFail(obj.id);
        await this.connection.getRepository(ApiPath).save(obj as ApiPath);
        return {
            id: obj.id
        }
    }

    async delete(id: string): Promise<Result> {
        await this.connection.getRepository(ApiPath).delete(id);
        return {
            id
        }
    }
}
