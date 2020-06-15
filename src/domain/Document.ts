import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne, OneToMany} from 'typeorm';

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

    @ManyToOne(type => Folder, folder => folder.documents)
    @JoinColumn()
    public folder: Folder;

    @OneToMany(type => DocumentContent, content => content.document, {cascade: true})
    public contents: DocumentContent[];

    @OneToOne(type => DocumentContent, content => content.document)
    public current: DocumentContent;
}

@Entity({name: 'document_content'})
export class DocumentContent extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => Document, document => document.contents)
    @JoinColumn()
    public document: Document;

    @Column({default: '', type: 'text'})
    public contents: String;
}
