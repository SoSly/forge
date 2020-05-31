import Router from '@koa/router';
import Koa, { Context } from 'koa';
import { Config } from 'convict';

class Welcome {
    router: Router;

    constructor() {
        this.router = new Router();
        this.router.get('/', this.handleDefaultRoute);
    }

    handleDefaultRoute(ctx: Context) {
        ctx.body = 'Welcome to Forge';
    }
}

export function setupWelcomeMiddleware(app: Koa, config: Config<any>) {
    const welcome = new Welcome();
    app.use(welcome.router.routes());
}
