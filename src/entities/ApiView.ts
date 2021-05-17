import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Audit } from '../dao/Audit';

@Entity('t_api_view', {
    schema: 's_abt'
})
@Unique('cin_i_api_view_1', ['name'])
export class ApiView extends Audit {
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
        name: 'cv_description',
        length: 4000,
        nullable: true,
    })
    description?: string;
}
