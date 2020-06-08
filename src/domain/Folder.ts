import {Entity, Column, PrimaryColumn, BaseEntity, Index, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';

// Models
import {Document} from './Document';
import {User} from './User';

@Entity({name: 'folder'})
export class Folder extends BaseEntity {
    @PrimaryColumn({type: 'char', length: 16})
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User, user => user.folders)
    public user: User;
    
    @ManyToOne(type => Folder, folder => folder.children)
    public parent: Folder;

    @OneToMany(type => Folder, folder => folder.parent)
    public children: Folder[];

    @OneToMany(type => Document, document => document.folder)
    public documents: Document[];
}
