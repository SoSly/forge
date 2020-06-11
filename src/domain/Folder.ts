import FlakeId from 'flake-idgen';
import {Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Tree, TreeChildren, TreeParent, JoinColumn, getTreeRepository, getConnection, BeforeRemove} from 'typeorm';

// Models
import {Document} from './Document';
import {User} from './User';
import { Query } from 'typeorm/driver/Query';

@Entity({name: 'folder'})
@Tree('closure-table')
export class Folder extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User, user => user.folders)
    @JoinColumn({name: 'User'})
    public user: User;
    
    @TreeParent()
    public parent: Folder;

    @TreeChildren({cascade: ['remove', 'update']})
    public children: Folder[];

    // @OneToMany(type => Document, document => document.folder)
    // public documents: Document[];

    public static async createChildFolder(parentId: number, name: string): Promise<Folder> {
        const parent = await Folder.findOne({id: parentId}, {relations: ['user']});
        if (parent === undefined) throw new Error(`Could not find parent folder with ID '${parentId}'.`);
        // const id = new FlakeId().next().toString('hex');
        const folder = Folder.create({name});
        folder.parent = <Folder>parent;
        folder.user = parent.user;
        return await folder.save();
    }

    public static async setParentFolder(folder: Folder, id: number, validateFolderOwner: (folder: Folder|undefined) => void): Promise<void> {
        const tr = getTreeRepository(Folder)
        const parent = await tr.findOne({id}, {relations: ['user']});
        validateFolderOwner(parent);        
        await tr.findAncestorsTree(parent!);
        await tr.findDescendantsTree(folder);
        folder.parent = parent!;
        const queries: Array<Query> = [];
        queries.push({query: `UPDATE "folder" SET "parentId" = $1 WHERE "id" = $2`, parameters: [parent?.id, folder.id]});
        generateClosureDeletions(queries, folder);
        queries.push({query:`INSERT INTO "folder_closure" ("id_ancestor", "id_descendant") VALUES` + 
            generateClosureRelations(folder).map(({id_ancestor, id_descendant}) => ` (${id_ancestor}, ${id_descendant})`).join(',')});
        return runQueries(queries);
    }

    @BeforeRemove()
    private async deleteRelations() {
        const tr = getTreeRepository(Folder);
        await tr.findDescendantsTree(this);
        const queries: Array<Query> = [];
        generateClosureDeletions(queries, this);
        return runQueries(queries);
    }
}

interface ClosureRelation {
    id_ancestor: number,
    id_descendant: number,
}

function generateClosureDeletions(queries: Array<Query>, folder: Folder): void {
    queries.push({query: `DELETE FROM "folder_closure" WHERE "id_descendant" = $1`, parameters: [folder.id]});
    folder.children.forEach((child) => generateClosureDeletions(queries, child));
}

function generateClosureRelations(folder: Folder): Array<ClosureRelation> {
    const selfRelation = {
        id_ancestor: folder.id,
        id_descendant: folder.id
    };
    const ancestorRelations = generateAncestorClosureRelations(folder, folder.id);
    const descendantRelations = generateDescendantClosureRelations(folder);

    return [selfRelation, ...ancestorRelations, ...descendantRelations];
}

function generateAncestorClosureRelations(folder: Folder, descendantId: number): Array<ClosureRelation> {
    if (folder.parent) {
        const relation = {
            id_ancestor: folder.parent.id,
            id_descendant: descendantId
        }
        return [relation, ...generateAncestorClosureRelations(folder.parent, descendantId)];
    }
    return [];
}

function generateDescendantClosureRelations(folder: Folder): Array<ClosureRelation> {
    return folder.children.reduce((acc, child) => {
        child.parent = folder;
        return [...acc, ...generateClosureRelations(child)]
    }, [])
}

async function runQueries(queries: Array<Query>): Promise<void> {
    const qr = getConnection().createQueryRunner();
    qr.startTransaction();
    try {
        for (const query of queries) {
            await qr.query(query.query, query.parameters);
        }
        await qr.commitTransaction();
    }
    catch(err) {
        await qr.rollbackTransaction();
        throw err;
    }
    finally {
        await qr.release();
    }
}
