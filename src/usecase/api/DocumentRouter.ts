import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {AbstractRouter} from './AbstractRouter';
import {DeepPartial, getConnection} from 'typeorm';
import * as Usage from '@usecase/helpers/Usage';
import { forge } from 'types';

// Models
import {Document, DocumentContent} from '@domain/DocumentEntities';
import {Folder} from '@domain/FolderEntities';

function validateOwnership(ctx: Context, obj: Folder|Document|undefined): void {
    if (!obj) ctx.throw(404);
    if (obj!.user!.id !== ctx.state.user.id) ctx.throw(401);
}

class DocumentRouter extends AbstractRouter {
    private config: forge.Config;
    
    constructor(config: forge.Config) {
        super();

        this.config = config;

        // configure routes
        this.router = new Router({prefix: '/api/document'});
        this.router.get('/:id', this.getDocument);
        this.router.delete('/:id', this.deleteDocument);
        this.router.patch('/:id', this.patchDocument);
        this.router.post('/', this.postDocument);
    }

    private async getDocument(ctx: Context, next: Next): Promise<void> {
        try {
            const id = ctx.params.id;
            const document = await Document.findOne({id}, {relations: ['current', 'user']});
            validateOwnership(ctx, document);
            ctx.type = 'json';
            ctx.body = document;
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }

    private async deleteDocument(ctx: Context, next: Next): Promise<void> {
        try {
            const id = ctx.params.id;
            const document = await Document.findOne({id}, {relations: ['current', 'folder', 'user']});
            validateOwnership(ctx, document);
            await Document.remove(document!);
            await Folder.updateSize(document!.folder.id);
            ctx.status = 203;
            ctx.body = '';
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }

    private async patchDocument(ctx: Context, next: Next): Promise<void> {
        try {
            if (await Usage.isOverLimit(ctx.state.user)) {
                return ctx.throw(402);
            }

            const id = ctx.params.id;
            const document = await Document.findOne({id}, {relations: ['current', 'folder', 'user']});
            validateOwnership(ctx, document);

            const changes = ctx.request.body;
            for (let field in changes) {
                switch (field) {
                    case 'folderId': 
                        const folder = await Folder.findOne({id: changes[field]}, {relations: ['user', 'parent']});
                        validateOwnership(ctx, folder);
                        document!.folder = folder!;
                        await document!.folder!.save();
                        break;
                    case 'contents':
                        document!.current.contents = changes[field];
                        await document!.current.save();
                        break;
                    default:
                        document![field] = changes[field];
                       break;
                }
            }
            await document!.updateDocumentSize();
            await document!.save();

            await Folder.updateSize(document!.folder.id);
 
            ctx.status = 204;
            ctx.body = '';
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }

    private async postDocument(ctx: Context, next: Next): Promise<void> {
        try {
            if (await Usage.isOverLimit(ctx.state.user)) {
                return ctx.throw(402);
            }

            const {name, folderId} = ctx.request.body;
            const user = ctx.state.user;

            const folder = await Folder.findOne({id: folderId}, {relations: ['user']});
            validateOwnership(ctx, folder);

            const results = await getConnection().createQueryBuilder()
                .insert().into(Document).values({name, folder, user}).returning("*")
                .execute();
            const document = Document.create(results.generatedMaps[0] as DeepPartial<Document>);
            document.folder = folder!;

            const content = DocumentContent.create();
            document.current = content;
            await document.updateDocumentSize();
            await document.save();

            await Folder.updateSize(document!.folder.id);

            ctx.status = 201;
            ctx.type = 'json';
            ctx.body = document;
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }
}

export function setupDocumentMiddleware(app: Koa, config: forge.Config): void {
    const document = new DocumentRouter(config);
    app.use(document.routes());
    app.use(document.allowedMethods());
}
