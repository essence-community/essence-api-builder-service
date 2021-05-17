import {ManyToOne,  Column,   Entity,   JoinColumn,   PrimaryGeneratedColumn, Unique} from 'typeorm';
import { Audit } from '../dao/Audit';
import { ApiView } from './ApiView';

@Entity('t_api_info', {
    schema: 's_abt'
})
@Unique('cin_i_api_info_1', ['apiView'])
export class ApiInfo extends Audit {
    @PrimaryGeneratedColumn('uuid', {
        name: 'ck_id',
    })
    id: string;

    @Column({
        name: 'cv_name',
        length: 255,
    })
    name: string;

    @Column({
        name: 'cv_version',
        length: 255,
    })
    version: string;

    @Column({
        name: 'cv_description',
        nullable: true,
    })
    description?: string;

    @JoinColumn({
        name: 'ck_api_view',
    })
    @ManyToOne(type => ApiView, {
        nullable: false,
    })
    apiView: ApiView;
}
