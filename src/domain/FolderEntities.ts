import {Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Tree, TreeChildren, TreeParent, JoinColumn, getTreeRepository, getConnection, BeforeRemove, OneToMany, getRepository} from 'typeorm';

// Models
import {Document, DocumentResponse} from './DocumentEntities';
import {Auth} from './UserEntities';
import {Query} from 'typeorm/driver/Query';

export class FolderResponse {
    public id: string;
    public name: string;
    public createdAt: Date;
    public updatedAt: Date;
    public size: number;
    public children: FolderResponse[] | undefined;
    public documents: DocumentResponse[] | undefined;
    public parent: Folder;
}

@Entity({name: 'folder'})
@Tree('closure-table')
export class Folder extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public name: string;

    @Column({type: 'int'})
    public size: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => Auth, user => user.folders)
    @JoinColumn({name: 'id_auth'})
    public user: Auth;
    
    @TreeParent()
    @JoinColumn({name: 'id_parent'})
    public parent: Folder;

    @TreeChildren({cascade: ['remove', 'update']})
    public children: Folder[];

    @OneToMany(type => Document, document => document.folder)
    public documents: Document[];

    public static async createChildFolder(parentId: string, name: string): Promise<Folder> {
        const parent = await Folder.findOne({id: parentId}, {relations: ['user']});
        if (parent === undefined) throw new Error(`Could not find parent folder with ID '${parentId}'.`);
        const folder = Folder.create({name});
        folder.parent = <Folder>parent;
        folder.user = parent.user;
        return await folder.save();
    }

    public static async setParentFolder(folder: Folder, id: string, validateFolderOwner: (folder: Folder|undefined) => void): Promise<void> {
        const tr = getTreeRepository(Folder)
        const parent = await tr.findOne({id}, {relations: ['user']});
        validateFolderOwner(parent);        
        await tr.findAncestorsTree(parent!);
        await tr.findDescendantsTree(folder);
        folder.parent = parent!;
        const queries: Array<Query> = [];
        queries.push({query: `UPDATE "folder" SET "id_parent" = $1 WHERE "id" = $2`, parameters: [parent?.id, folder.id]});
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
        await runQueries(queries);

        const documents = await Document.find({relations: ['current'], where: {folder: this}});
        for (const document of documents) {
            try {
                await document.remove();
            }
            catch (err) { 
                console.error(err); 
            }
        }

        return;
    }

    public static async updateSize(id: string) {
        const folder = await Folder.findOne(id, {relations: ['children', 'documents', 'parent']});
        let size = folder!.name.length;
        for (const child of folder!.children) {
            size += child.size;
        }
        for (const document of folder!.documents) {
            size += document.size;
        }
        folder!.size = size;
        await folder!.save();

        if (folder!.parent) {
            await Folder.updateSize(folder!.parent.id);
        }
    }

    public static async getRootFolder(auth: Auth) {
        return await getRepository(Folder).createQueryBuilder('Folder')
            .innerJoin('Folder.user', 'User')
            .where('User.id = :id', {id: auth.id})
            .andWhere('Folder.parent IS NULL')
            .getOne();
    }
}

interface ClosureRelation {
    id_ancestor: string,
    id_descendant: string,
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

function generateAncestorClosureRelations(folder: Folder, descendantId: string): Array<ClosureRelation> {
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
