import {ManyToOne, Column, Entity, JoinColumn, PrimaryGeneratedColumn, Unique} from 'typeorm';
import { Audit } from '../dao/Audit';
import { ApiView } from './ApiView';
import { Pairs } from '../types/Pairs';

@Entity('t_api_path', {
    schema: 's_abt'
})
@Unique('cin_i_api_path_1', ['path', 'apiView'])
export class ApiPath extends Audit {
    @PrimaryGeneratedColumn('uuid', {
        name: 'ck_id',
    })
    id: string;

    @Column({
        name: 'ck_path',
        length: 255,
    })
    path: string;

    @Column({
        name: 'ck_object',
        length: 32,
    })
    objectId: string;

    @Column({
        name: 'cv_schema',
        nullable: true,
    })
    schema?: string;

    @Column({
        name: 'cv_table',
        nullable: false,
    })
    table: string;

    @Column({
        name: 'cv_description',
        nullable: true,
    })
    description?: string;

    @Column({
        name: 'cct_global_value',
        type: 'jsonb',
        nullable: false,
        default: () => "'[]'::jsonb",
    })
    globalValue: Pairs[] = [];

    @Column({
        name: 'cct_master',
        type: 'jsonb',
        nullable: false,
        default: () => "'[]'::jsonb",
    })
    master: Pairs[] = [];

    @JoinColumn({
        name: 'ck_api_view'
    })
    @ManyToOne(type => ApiView, {
        nullable: false,
    })
    apiView: ApiView;
}
