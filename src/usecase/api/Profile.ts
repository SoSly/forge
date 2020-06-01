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
        this.router.get('/profile', this.handleProfile);
    }

    private async handleProfile(ctx: Context, next: Next): Promise<void> {
        ctx.type = 'json';
        ctx.body = ctx.state.user;
    }

    public routes(): Middleware {
        return this.router.routes();
    }
}

export function setupProfileMiddleware(app: Koa, config: Config<any>): void {
    const profile = new Profile(config);
    app.use(profile.routes());
}
