import { ApiView } from '../entities/ApiView';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Audit } from '../dao/Audit';
import { ApiField } from '../entities/ApiField';
import { ApiInfo } from '../entities/ApiInfo';
import { ApiPath } from '../entities/ApiPath';

@Entity()
export class ApiViewModel {
    view: ApiView;
    field: ApiField;
    info: ApiInfo;
    path: ApiPath[];
}
