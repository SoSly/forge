import Router from '@koa/router';
import {Middleware} from 'koa';

export class AbstractRouter {
    protected router: Router;
    
    public routes(): Middleware {
        return this.router.routes();
    }

    public allowedMethods(): Middleware {
        return this.router.allowedMethods();
    }
}
