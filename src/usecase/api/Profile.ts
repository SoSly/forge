import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {AbstractRouter} from './AbstractRouter';

class ProfileRouter extends AbstractRouter {
    private config: Config<any>;

    constructor (config: Config<any>) {
        super();

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
            await ctx.state.user.settings.save();

            ctx.status = 201;
            ctx.body = '';
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = {err};
        }
    }
}

export function setupProfileMiddleware(app: Koa, config: Config<any>): void {
    const profile = new ProfileRouter(config);
    app.use(profile.routes());
    app.use(profile.allowedMethods());
}
