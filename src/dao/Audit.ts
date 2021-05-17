import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Audit {
    @CreateDateColumn({
        name: 'ct_create',
    })
    create: Date;
    @UpdateDateColumn({
        name: 'ct_change',
    })
    change: Date;
    @Column({
        name: 'ck_user',
        nullable: false,
        length: 100,
        default: () => '999999',
    })
    user: string;    
}