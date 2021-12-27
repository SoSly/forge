import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn, OneToOne, BeforeRemove} from 'typeorm';
import { forge } from '../types';

// Models
import {Folder} from './FolderEntities';
import {Auth} from './UserEntities';

export class DocumentResponse {
    public id: string;
    public name: string;
    public type: string;
    public createdAt: Date;
    public updatedAt: Date;
    public current: {
        id: string;
        contents: string;
    }
    public size: number;
}

@Entity({name: 'document'})
export class Document extends BaseEntity implements forge.Document {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @Column({type: 'enum', enum: ['markdown', 'stylesheet'], default: 'markdown'})
    public type: 'markdown' | 'stylesheet';

    @Column({type: 'int'})
    public size: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => Auth)
    @JoinColumn({name: 'id_auth'})
    public user: Auth;

    @ManyToOne(type => Folder, folder => folder.documents, {cascade: true})
    @JoinColumn({name: 'id_folder'})
    public folder: Folder;

    @OneToOne(type => DocumentContent, content => content.document, {cascade: true, onDelete: 'CASCADE'})
    public current: forge.DocumentContent;

    public async updateDocumentSize(): Promise<this> {
        if (this.current && this.current.contents) {
            this.size = this.name.length + this.current.contents.length;
        }
        return this
    }

    @BeforeRemove()
    public async removeCurrentContents(): Promise<this> {
        await this.current?.remove();
        return this
    }
}

@Entity({name: 'document_content'})
export class DocumentContent extends BaseEntity implements forge.DocumentContent {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @OneToOne(type => Document, document => document.current)
    @JoinColumn({name: 'id_document'})
    public document: forge.Document;

    @Column({default: '', type: 'text'})
    public contents: string;
}
