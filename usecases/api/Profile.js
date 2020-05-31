import Router from '@koa/router';

class Profile {
    constructor() {
        this.router = new Router();
        this.router.get('/profile', this.handleProfile);
    }

    handleProfile(ctx) {
        ctx.body = `Welcome ${ctx.state.user.username}.`;
    }
}

export default function getProfileMiddleware(app, config) {
    const profile = new Profile();
    app.use(profile.router.routes());
}
