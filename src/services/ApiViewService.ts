import { Injectable } from '@nestjs/common';
import { Result } from '../dto/Result';
import { Connection } from 'typeorm';
import { ApiView } from '../entities/ApiView';

@Injectable()
export class ApiViewService {
    constructor(private connection: Connection) {}
    
    async findAll(offset = '0', fetch = '2000', id?: string): Promise<[ApiView[], number]> {
        return this.connection.getRepository(ApiView).findAndCount({
            where: id? {id} : undefined,
            take: parseInt(fetch, 10),
            skip: parseInt(offset, 10),
        });
    }
    async add(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        const res = await this.connection.getRepository(ApiView).save(obj as ApiView);
        return {
            id: res.id
        }
    }

    async update(obj: any, user = '999999'): Promise<Result> {
        obj.user = user;
        const res = await this.connection.getRepository(ApiView).save(obj as ApiView);
        return {
            id: res.id
        }
    }

    async delete(id: string): Promise<Result> {
        await this.connection.getRepository(ApiView).delete(id);
        return {
            id
        }
    }
}
