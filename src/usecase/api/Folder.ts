import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next, Middleware} from 'koa';
import {Folder} from '@domain/Folder';
import {User} from '@domain/User';

function validateFolderOwner(ctx: Context, folder: Folder|undefined): void {
    if (!folder) ctx.throw(404);
    if (folder.user.id !== ctx.state.user.id) ctx.throw(401);
}

class FolderRouter {
    private config: Config<any>;
    private router: Router;

    constructor (config: Config<any>) {
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
            const folder = await Folder.findOne({id});
            validateFolderOwner(ctx, folder);
            await Folder.delete(folder!);
            ctx.status = 203;
            ctx.body = '';
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = {err};
        }
    }

    private async getFolder(ctx: Context, next: Next): Promise<void> {
        try {
            const user = ctx.state.user;
            const id = ctx.params.id || user.id;
            const folder = await Folder.findOne({id}, {relations: ['children', 'parent', 'user']});
            validateFolderOwner(ctx, folder);
            ctx.type = 'json';
            ctx.body = folder;
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = {err};
        }
    }

    private async patchFolder(ctx: Context, next: Next): Promise<void> {
        try {
            const id = ctx.params.id;
            const folder = await Folder.findOne({id}, {relations: ['user']});
            validateFolderOwner(ctx, folder);
            const changes = ctx.request.body;
            for (let field in changes) {
                folder![field] = changes[field];
            }
            await folder!.save();
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
            const body = ctx.request.body;
            const parentFolder = await Folder.findOne({id: body.parentId}, {relations: ['user']});
            validateFolderOwner(ctx, parentFolder);
            const folder = await Folder.createChildFolder(body.parentId, body.name);
            ctx.status = 201;
            ctx.type = 'json';
            ctx.body = folder;
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }

    public routes(): Middleware {
        return this.router.routes();
    }

    public allowedMethods(): Middleware {
        return this.router.allowedMethods();
    }
}

export function setupFolderMiddleware(app: Koa, config: Config<any>): void {
    const profile = new FolderRouter(config);
    app.use(profile.routes());
    app.use(profile.allowedMethods());
}
