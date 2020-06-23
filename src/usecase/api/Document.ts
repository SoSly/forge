import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {AbstractRouter} from './AbstractRouter';
import {DeepPartial, getConnection} from 'typeorm';

// Models
import {Document, DocumentContent} from '@domain/DocumentEntities';
import {Folder} from '@domain/FolderEntities';

function validateOwnership(ctx: Context, obj: Folder|Document|undefined): void {
    if (!obj) ctx.throw(404);
    if (obj.user.id !== ctx.state.user.id) ctx.throw(401);
}

class DocumentRouter extends AbstractRouter {
    private config: Config<any>;
    
    constructor(config: Config<any>) {
        super();

        this.config = config;

        // configure routes
        this.router = new Router({prefix: '/api'});
        this.router.get('/document/:id', this.getDocument);
        this.router.delete('/document/:id', this.deleteDocument);
        this.router.patch('/document/:id', this.patchDocument);
        this.router.post('/document', this.postDocument);
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
            const document = await Document.findOne({id}, {relations: ['current', 'user']});
            validateOwnership(ctx, document);
            await Document.remove(document!);
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
            const id = ctx.params.id;
            const document = await Document.findOne({id}, {relations: ['current', 'user']});
            validateOwnership(ctx, document);

            const changes = ctx.request.body;
            for (let field in changes) {
                switch (field) {
                    case 'folderId': 
                        const folder = await Folder.findOne({id: changes[field]}, {relations: ['user']});
                        validateOwnership(ctx, folder);

                        document!.folder = folder!;
                        continue;
                    case 'contents':
                        document!.current.contents = changes[field];
                        await document!.current.save();
                        break;
                    default:
                        document![field] = changes[field];
                        break;
                }
            }

            await document!.save();
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
            const {name, folderId} = ctx.request.body;
            const user = ctx.state.user;
            
            const folder = await Folder.findOne({id: folderId}, {relations: ['user']});
            validateOwnership(ctx, folder);

            const results = await getConnection().createQueryBuilder()
                .insert().into(Document).values({name, folder, user}).returning("*")
                .execute();
            const document = Document.create(results.generatedMaps[0] as DeepPartial<Document>);

            const content = DocumentContent.create();
            document.current = content;
            await document.save();

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

export function setupDocumentMiddleware(app: Koa, config: Config<any>): void {
    const document = new DocumentRouter(config);
    app.use(document.routes());
    app.use(document.allowedMethods());
}
