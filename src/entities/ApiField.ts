import {ManyToOne,  Column,   Entity,   JoinColumn,   PrimaryGeneratedColumn, Unique} from 'typeorm';
import { Audit } from '../dao/Audit';
import { ApiView } from './ApiView';
import { Pairs } from '../types/Pairs';

@Entity('t_api_field', {
    schema: 's_abt'
})
@Unique('cin_i_api_field_1', ['apiView'])
export class ApiField extends Audit {
    @PrimaryGeneratedColumn('uuid', {
        name: 'ck_id',
    })
    id: string;

    @Column({
        name: 'cv_contact_name',
        length: 255,
    })
    contactName: string;

    @Column({
        name: 'cv_contact_email',
        length: 255,
        nullable: true,
    })
    contactEmail?: string;

    @Column({
        name: 'cv_info_url',
        length: 255,
        nullable: true,
    })
    infoUrl?: string;

    @Column({
        name: 'cv_info_description',
        nullable: true,
    })
    infoDescription?: string;

    @Column({
        name: 'cct_extra_field',
        type: 'jsonb',
        nullable: false,
        default: () => "'[]'::jsonb",
    })
    extraField: Pairs[] = [];

    @JoinColumn({
        name: 'ck_api_view',
    })
    @ManyToOne(type => ApiView, {
        nullable: false,
    })
    apiView: ApiView;
}
