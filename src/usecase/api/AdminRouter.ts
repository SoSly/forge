import Router from "@koa/router";
import { forge } from "types";
import Koa, { Context, Next } from "koa";
import { AbstractRouter } from "./AbstractRouter";
import { AuditLog } from "@domain/AdminEntities";

const LOG_PAGINATION_LIMIT = 50;

class AdminRouter extends AbstractRouter {
    private config: forge.Config;

    constructor(config: forge.Config) {
        super();

        this.config = config;

        // configure routes
        this.router = new Router({prefix: '/api/admin'});
        this.router.get('/audit', this.getAuditLogs);
    }

    private async getAuditLogs(ctx: Context, next: Next): Promise<void> {
        if (!ctx.state.user?.rights?.audit) {
            ctx.status = 403;
            return;
        }

        try {
            let skip = ctx.query.page ?? 1;
            if (typeof skip !== 'number') {
                skip = 1;
            }
            const [entries, count] = await AuditLog.findAndCount({skip, take: LOG_PAGINATION_LIMIT});
            const pages = Math.ceil(count/LOG_PAGINATION_LIMIT);
            ctx.type = 'json';
            ctx.body = {page: 1, entries, pages};
        }
        catch (err) {
            console.error(err);
            ctx.status = 400;
            ctx.type = 'json';
            ctx.body = {err};
        }
    }
}

export function setupAdminMiddleware(app: Koa, config: forge.Config): void {
    const admin = new AdminRouter(config);
    app.use(admin.routes());
    app.use(admin.allowedMethods());
}