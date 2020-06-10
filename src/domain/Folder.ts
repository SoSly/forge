import FlakeId from 'flake-idgen';
import {Entity, Column, PrimaryColumn, BaseEntity, Index, ManyToOne, OneToMany, CreateDateColumn, DeepPartial, UpdateDateColumn} from 'typeorm';

// Models
import {Document} from './Document';
import {User} from './User';

const ROOT_FOLDER_NAME = 'Root Folder';

@Entity({name: 'folder'})
export class Folder extends BaseEntity {
    @PrimaryColumn({type: 'varchar', length: 16})
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User, user => user.folders)
    public user: User;
    
    @ManyToOne(type => Folder, folder => folder.children, {cascade: true})
    public parent: Folder;

    @OneToMany(type => Folder, folder => folder.parent)
    public children: Folder[];

    @OneToMany(type => Document, document => document.folder, {cascade: true})
    public documents: Document[];

    public static async createChildFolder(parentId: string, name: string): Promise<Folder> {
        const parent = await Folder.findOne({id: parentId}, {relations: ['user']});
        if (parent === undefined) throw new Error(`Could not find parent folder with ID '${parentId}'.`);
        const id = new FlakeId().next().toString('hex');
        const folder = Folder.create({id, name});
        folder.parent = <Folder>parent;
        folder.user = parent.user;
        return await folder.save();
    }
}
