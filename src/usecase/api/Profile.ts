import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next, Middleware} from 'koa';

class Profile {
    private config: Config<any>;
    private router: Router;

    constructor (config: Config<any>) {
        this.config = config;

        // configure routes
        this.router = new Router({prefix: '/api'});
        this.router.get('/profile', this.getProfile);
        this.router.patch('/settings', this.patchSettings);
    }

    private async getProfile(ctx: Context, next: Next): Promise<void> {
        ctx.type = 'json';
        ctx.body = ctx.state.user;
    }

    private async patchSettings(ctx: Context, next: Next): Promise<void> {
        try {
            const changes = ctx.request.body;
            for (let field in changes) {
                ctx.state.user.settings[field] = changes[field];
            }
            ctx.status = 201;
            ctx.body = '';

            await ctx.state.user.settings.save();
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = {err};
        }
    }

    public routes(): Middleware {
        return this.router.routes();
    }

    public allowedMethods(): Middleware {
        return this.router.allowedMethods();
    }
}

export function setupProfileMiddleware(app: Koa, config: Config<any>): void {
    const profile = new Profile(config);
    app.use(profile.routes());
    app.use(profile.allowedMethods());
}
