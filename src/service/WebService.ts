import {Config} from "convict";
import Koa from 'koa';
import KoaLogger from 'koa-logger';
import {Server} from 'net';
import Session from 'koa-session';

import bodyParser from "koa-bodyparser";
import path from 'path';
import serve from 'koa-static';
import {setupAuthMiddleware} from "@usecase/api/Auth";
import {setupFolderMiddleware} from "@usecase/api/Folder";
import {setupProfileMiddleware} from "@usecase/api/Profile";

export default class WebService {
    app: Koa;
    port: number;
    server: Server;

    constructor(config: Config<any>) {       
        this.app = new Koa();
        this.app.use(KoaLogger());
        this.port = config.get('HTTP').port;


        this.app.keys = ['my secret'];
        this.app.use(Session({}, this.app));
        this.app.use(bodyParser());
        this.app.use(serve(path.resolve('./public')))

        setupAuthMiddleware(this.app, config);
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
