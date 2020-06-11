import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';

// Models
import { Folder } from './Folder';
import { User } from './User';

@Entity({name: 'document'})
export class Document extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User)
    public user: User;

    @ManyToOne(type => Folder, folder => folder.documents, {cascade: true})
    @JoinColumn()
    public folder: Folder;
}
