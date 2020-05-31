import Router from "@koa/router";

class Welcome {
    constructor() {
        this.router = new Router();
        this.router.get('/', this.handleDefaultRoute);
    }

    handleDefaultRoute(ctx) {
        ctx.body = 'Welcome to Forge';
    }
}

export default function getWelcomeMiddleware(app, config) {
    const welcome = new Welcome();
    app.use(welcome.router.routes());
}
