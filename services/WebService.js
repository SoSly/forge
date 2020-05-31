import BodyParser from 'koa-bodyparser';
import Koa from 'koa';
import KoaLogger from 'koa-logger';
import Session from 'koa-session';

import getAuthMiddleware from '../usecases/api/Auth.js';
import getProfileMiddleware from '../usecases/api/Profile.js';
import getWelcomeMiddleware from '../usecases/api/Welcome.js';

export default class WebService {
    // The Koa application
    app;

    // The HTTP configuration object
    config;

    // The active http server
    server;

    constructor(config) {
        this.config = config.get('HTTP');

        this.app = new Koa();
        this.app.use(KoaLogger());
        
        // sessions
        this.app.keys = ['random-session-secret'];
        this.app.use(Session({}, this.app));

        // body parser
        this.app.use(BodyParser());

        // authless routes
        getWelcomeMiddleware(this.app, config);

        // authorization
        getAuthMiddleware(this.app, config);

        // auth only routes
        getProfileMiddleware(this.app, config);

        // Start listening on the assigned port.
        this.server = this.app.listen(this.config.port);
    }

    async stop() {
        console.log();
        await this.server.close();
    }
}
