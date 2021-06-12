import { Injectable } from '@nestjs/common';
import { Result } from '../dto/Result';
import { Connection } from 'typeorm';
import { ApiField } from '../entities/ApiField';
import { ApiView } from '../entities/ApiView';

@Injectable()
export class ApiViewField {
    constructor(private connection: Connection) {}
    
    async findAll(idView: string, offset = '0', fetch = '2000', id?: string): Promise<[ApiField[], number]> {
        return this.connection.getRepository(ApiField).findAndCount({
            where: {apiView: { id: idView }, ...(id? {id} : {})},
            relations: ['apiView'],
            take: parseInt(fetch, 10),
            skip: parseInt(offset, 10),
        });
    }
    async add(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        obj.apiView = await this.connection.getRepository(ApiView).findOne(obj.idApiView);
        const res = await this.connection.getRepository(ApiField).save(obj as ApiField);
        return {
            id: res.id
        }
    }

    async update(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        obj.apiView = await this.connection.getRepository(ApiView).findOne(obj.idApiView);
        await this.connection.getRepository(ApiField).findOneOrFail(obj.id);
        await this.connection.getRepository(ApiField).save(obj as ApiField);
        return {
            id: obj.id
        }
    }

    async delete(id: string): Promise<Result> {
        await this.connection.getRepository(ApiField).delete(id);
        return {
            id
        }
    }
}
