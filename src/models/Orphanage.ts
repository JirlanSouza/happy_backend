import { Entity, Column, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import Image from './Image'
import { v4 as uuidv4 } from 'uuid'

@Entity('orphanages')
export default class Orphanage {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    about: string;

    @Column()
    instructions: string;

    @Column()
    opening_hours: string;

    @Column()
    open_on_weekends: boolean;

    @OneToMany(() => Image, image => image.orphanage, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'orphanage_id'})
    images: Image[];

    @Column()
    pendingApproval: boolean;
}