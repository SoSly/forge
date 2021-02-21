import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {AbstractRouter} from './AbstractRouter';

import {Interpreter} from '../parser/Interpreter';
import {Parser} from '../parser/Parser';

class RollerRouter extends AbstractRouter {
    private config: Config<any>;
    private interpreter: Interpreter;

    constructor(config: Config<any>) {
        super();

        this.config = config;
        this.interpreter = new Interpreter;
        // configure routes
        this.router = new Router({prefix: '/api'});
        this.router.get('/roll/:expression', this.getRoll);
    }

    private async getRoll(ctx: Context, next: Next): Promise<void> {
        const expression = ctx.params.expression;

        try {
            const parser = new Parser(expression);
            const parsed = parser.parse();
            
            if (parsed.errs.length > 0 || !parsed.ast) {
                ctx.status = 400;
                ctx.body = parsed.errs;
            }

            const result = await this.interpreter.interpret(parsed.ast!);
            ctx.body = result;
        } catch(err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }
}

export function setupRollerMiddleware(app: Koa, config: Config<any>): void {
    const viewer = new RollerRouter(config);
    app.use(viewer.routes());
    app.use(viewer.allowedMethods());
}
