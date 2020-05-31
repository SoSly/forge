import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context} from 'koa';

class Profile {
    router: Router;

    constructor() {
        this.router = new Router();
        this.router.get('/profile', this.handleProfile);
    }

    handleProfile(ctx: Context) {
        ctx.body = `Welcome ${ctx.state.user.username}.`;
    }
}

export function setupProfileMiddleware(app: Koa, config: Config<any>) {
    const profile = new Profile();
    app.use(profile.router.routes());
}
