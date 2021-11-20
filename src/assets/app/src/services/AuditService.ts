import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Result } from '../dto/Result';
import { JsonBody } from '../dto/JsonBody';
import { Connection } from 'typeorm';
import { AuditModel } from '../entities/AuditModel';
import { filterEntity, sortEntity, filterEqualsEntity, plainToEntity } from '../utils/FilterAndSort';
import Logger from '../Logger';
import { noop } from '../utils/Base';

const logger = Logger.getLogger('AuditService');
@Injectable()
export class AuditService {
    constructor(private connection: Connection) {}
    
    async findAll(json: JsonBody, user = '999999', req: Request): Promise<[AuditModel[], number]> {
        const rep = this.connection.getRepository(AuditModel);
        return rep.findAndCount({
            where: {
                ...filterEqualsEntity(rep.metadata, json.filter),
                ...filterEntity(rep.metadata, json.filter.jl_filter)
            },
            order: sortEntity(rep.metadata, json.filter.jl_sort),
            take: parseInt(json.filter.jn_fetch || 2000, 10),
            skip: parseInt(json.filter.jn_offset || 0, 10),
        });
    }

    log(json: AuditModel): void {
        this.connection.getRepository(AuditModel).save(json).then(noop, (err) => {
            logger.error(err);
        });
    }

    async add(json: JsonBody, user = '999999', req: Request): Promise<Result> {
        const rep = this.connection.getRepository(AuditModel);
        const data: AuditModel = plainToEntity(rep.metadata, json.data) as AuditModel;
        data.ck_user = user;
        const result = await rep.save(data);
        return {
            ['ck_id']: result['ck_id']
        }
    }

    async update(json: JsonBody, user = '999999', req: Request): Promise<Result> {
        const rep = this.connection.getRepository(AuditModel);
        const data: AuditModel = plainToEntity(rep.metadata, json.data) as AuditModel;
        data.ck_user = user;
        await rep.findOneOrFail(data['ck_id']);
        const res = await rep.save(data);
        return {
            ['ck_id']: res['ck_id'],
        }
    }

    async delete(json: JsonBody, user = '999999', req: Request): Promise<Result> {
        await this.connection.getRepository(AuditModel).delete(json.data['ck_id']);
        return {
            ['ck_id']: json.data['ck_id'],
        }
    }
}
