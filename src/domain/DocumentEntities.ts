import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn, OneToOne, BeforeRemove, ValueTransformer} from 'typeorm';

// Models
import {Folder} from './FolderEntities';
import {Auth} from './UserEntities';

@Entity({name: 'document'})
export class Document extends BaseEntity {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @Column({type: 'enum', enum: ['markdown', 'stylesheet'], default: 'markdown'})
    public type: 'markdown' | 'stylesheet';

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => Auth)
    @JoinColumn({name: 'id_auth'})
    public user: Auth;

    @ManyToOne(type => Folder, folder => folder.documents)
    @JoinColumn({name: 'id_folder'})
    public folder: Folder;

    @OneToOne(type => DocumentContent, content => content.document, {cascade: true, onDelete: 'CASCADE'})
    public current: DocumentContent;

    @BeforeRemove()
    async removeCurrentContents() {
        await this.current?.remove();
    }
}

@Entity({name: 'document_content'})
export class DocumentContent extends BaseEntity {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @OneToOne(type => Document, document => document.current)
    @JoinColumn({name: 'id_document'})
    public document: Document;

    @Column({default: '', type: 'text'})
    public contents: string;
}
