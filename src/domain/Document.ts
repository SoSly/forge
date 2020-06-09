import {Entity, Column, PrimaryColumn, BaseEntity, DeepPartial, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm';

// Models
import { Folder } from './Folder';
import { User } from './User';

@Entity({name: 'document'})
export class Document extends BaseEntity {
    @PrimaryColumn({type: 'varchar', length: 16})
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @Column({type: 'text'})
    public content: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User, user => user.documents)
    public user: User;

    @ManyToOne(type => Folder, folder => folder.documents)
    public folder: Folder;
}
