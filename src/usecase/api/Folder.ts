import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {Document,DocumentResponse} from '@domain/DocumentEntities';
import {Folder,FolderResponse} from '@domain/FolderEntities';
import {getTreeRepository,IsNull} from 'typeorm';
import {AbstractRouter} from './AbstractRouter';
import * as Usage from '@usecase/helpers/Usage';

function validateFolderOwner(ctx: Context, folder: Folder|undefined): void {
    if (!folder) ctx.throw(404);
    if (folder.user.id !== ctx.state.user.id) ctx.throw(401);
}


function documentToDocumentResponse(document: Document): DocumentResponse {
    return <DocumentResponse>{
        id: document?.id,
        name: document?.name,
        createdAt: document?.createdAt,
        updatedAt: document?.updatedAt,
        size: document?.size
    }
}

function folderToFolderResponse(folder: Folder): FolderResponse {
    return <FolderResponse>{
        id: folder?.id,
        name: folder?.name,
        parent: folder?.parent,
        createdAt: folder?.createdAt,
        updatedAt: folder?.updatedAt,
        size: folder?.size,
    };
}

class FolderRouter extends AbstractRouter {
    private config: Config<any>;

    constructor (config: Config<any>) {
        super();

        this.config = config;

        // configure routes
        this.router = new Router({prefix: '/api'});
        this.router.delete('/folder/:id', this.deleteFolder);
        this.router.get('/folder', this.getFolder);
        this.router.get('/folder/:id', this.getFolder);
        this.router.patch('/folder/:id', this.patchFolder);
        this.router.post('/folder', this.postFolder);
    }

    private async deleteFolder(ctx: Context, next: Next): Promise<void> {
        try {
            const id = ctx.params.id;
            const folder = await getTreeRepository(Folder).findOne({id}, {relations: ['parent', 'user']});
            validateFolderOwner(ctx, folder);
            const children = await getTreeRepository(Folder).findDescendants(folder!);
            await getTreeRepository(Folder).remove(children);
            await getTreeRepository(Folder).remove(folder!);
            if (folder!.parent) {
                await Folder.updateSize(folder!.parent.id);
            }
            ctx.status = 203;
            ctx.body = '';
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }

    private async getFolder(ctx: Context, next: Next): Promise<void> {
        try {
            const user = ctx.state.user;
            const id = ctx.params.id;
            const searchParams = id ? {id} : {user, parent: IsNull()};
            const folder = await getTreeRepository(Folder).findOne(searchParams, {relations: ['children', 'documents', 'parent', 'user']});
            validateFolderOwner(ctx, folder);
            await getTreeRepository(Folder).findAncestorsTree(folder!);

            const res = folderToFolderResponse(folder!)
            res.children = folder?.children.map(folderToFolderResponse);
            res.documents = folder?.documents.map(documentToDocumentResponse);

            ctx.type = 'json';
            ctx.body = res;
        }
        catch (err) {
            console.error(err);
            ctx.status = 400;
            ctx.type = 'json';
            ctx.body = {err};
        }
    }

    private async patchFolder(ctx: Context, next: Next): Promise<void> {
        try {
            if (await Usage.isOverLimit(ctx.state.user)) {
                return ctx.throw(402);
            }

            const id = ctx.params.id;
            const folder = await getTreeRepository(Folder).findOne({id}, {relations: ['children', 'parent', 'user']});
            validateFolderOwner(ctx, folder);
            const changes = ctx.request.body;
            let parent: Folder|undefined;
            for (let field in changes) {    
                if (field === 'parentId') {
                    // TypeORM does not currently support updating the tree properly.
                    // We're going to have to do it manually.
                    // See: https://github.com/typeorm/typeorm/issues/2032
                    await Folder.setParentFolder(folder!, changes[field], 
                        (folder: Folder|undefined) => validateFolderOwner(ctx, folder));
                    continue;
                }

                folder![field] = changes[field];
            }

            await folder!.save();
            await Folder.updateSize(folder!.id);
            ctx.status = 204;
            ctx.body = '';
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }

    private async postFolder(ctx: Context, next: Next): Promise<void> {
        try {
            if (await Usage.isOverLimit(ctx.state.user)) {
                return ctx.throw(402);
            }
            
            const body = ctx.request.body;
            const parentFolder = await getTreeRepository(Folder).findOne({id: body.parentId}, {relations: ['user']});
            validateFolderOwner(ctx, parentFolder);
            const folder = await Folder.createChildFolder(body.parentId, body.name);
            await Folder.updateSize(folder!.id);
            ctx.status = 201;
            ctx.type = 'json';
            ctx.body = folder;
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }
}

export function setupFolderMiddleware(app: Koa, config: Config<any>): void {
    const folder = new FolderRouter(config);
    app.use(folder.routes());
    app.use(folder.allowedMethods());
}
