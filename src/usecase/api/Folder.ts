import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next, Middleware} from 'koa';
import {Folder} from '@domain/Folder';

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
            await Folder.delete({id});
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
            const folder = await Folder.findOne({id}, {relations: ['children', 'parent']});
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
            const folder = await Folder.findOne({id});
            if (folder === undefined) return ctx.throw(404);
            const changes = ctx.request.body;
            for (let field in changes) {
                folder[field] = changes[field];
            }
            console.log(folder);
            await folder.save();
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
