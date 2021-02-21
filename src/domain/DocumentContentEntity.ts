import {BaseEntity, Entity, PrimaryColumn, OneToOne, JoinColumn, Column} from "typeorm";
import {Document} from './DocumentEntity';

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
