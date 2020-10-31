import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export default class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    type: number;

    @Column()
    forgotToken: string;

    @Column()
    expiresForgotToken: number;
}