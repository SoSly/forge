import {Config} from "convict";
import Koa from 'koa';
import KoaLogger from 'koa-logger';
import {Server} from 'net';
import Session from 'koa-session';
import Rewrite from 'koa-rewrite';

import bodyParser from "koa-bodyparser";
import path from 'path';
import serve from 'koa-static';
import {setupAuthMiddleware} from "@usecase/api/Auth";
import {setupDocumentMiddleware} from "@usecase/api/Document";
import {setupFolderMiddleware} from "@usecase/api/Folder";
import {setupProfileMiddleware} from "@usecase/api/Profile";
import {setupViewerMiddleware} from "@usecase/api/Viewer";

export default class WebService {
    app: Koa;
    port: number;
    server: Server;

    constructor(config: Config<any>) {       
        this.app = new Koa();
        this.app.use(KoaLogger());
        this.port = config.get('HTTP').port;

        this.app.keys = ['my secret'];
        this.app.use(Session({
            key: config.get('Session').key,
            maxAge: config.get('Session').maxAge
        }, this.app));
        this.app.use(bodyParser());

        // Setup static file routing
        // Rewrite routes that don't match a specific file or an api or auth call to /
        this.app.use(Rewrite(/^\/((?!api|auth|view|.*\.ico|.*\.js|.*\.png|.*\.jpg|.*\.css).)+/i, '/'));
        this.app.use(serve(path.resolve('./public')));

        // Setup unrestricted middlewares
        setupViewerMiddleware(this.app, config);

        // Setup restricted middlewares
        setupAuthMiddleware(this.app, config);
        setupDocumentMiddleware(this.app, config);
        setupFolderMiddleware(this.app, config);
        setupProfileMiddleware(this.app, config);
    }

    async start(): Promise<void> {
        this.server = this.app.listen(this.port);
    }

    async stop(): Promise<void> {
        this.server.close();
    }
}
