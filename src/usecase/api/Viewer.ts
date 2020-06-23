import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {AbstractRouter} from './AbstractRouter';

// todo: put this somewhere the frontend and backend can both get at it.
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import Columnbreak from '../../../public/src/plugins/markdown/columnbreak';
import Pagebreak from '../../../public/src/plugins/markdown/pagebreak';
import TOC from '../../../public/src/plugins/markdown/toc';
import uslug from 'uslug';

const md = new MarkdownIt({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: true
});
md.use(Columnbreak);
md.use(MarkdownItAnchor);
md.use(Pagebreak);
md.use(TOC, {
    slugify: uslug,
    level: [1,2,3]
});

// Models
import {Document, DocumentContent} from '@domain/DocumentEntities';

function validateViewingPrivileges(ctx: Context, obj: Document|undefined): void {
    if (!obj) ctx.throw(404);
    
    // todo: implement privileges
}

class ViewerRouter extends AbstractRouter {
    private config: Config<any>;

    constructor (config: Config<any>) {
        super();

        this.config = config;

        // configure routes
        this.router = new Router();
        this.router.get('/view/:id', this.getDocument);
    }

    private async getDocument(ctx: Context, next: Next): Promise<void> {
        try {
            const id = ctx.params.id;
            const document = await Document.findOne({id}, {relations: ['current', 'user']});
            validateViewingPrivileges(ctx, document);

            switch (document?.type) {
                case 'stylesheet':
                    ctx.type = 'text/css;charset=utf-8';
                    ctx.body = document.current.contents;
                    break;
                case 'markdown':
                    ctx.type = 'text/html;charset=utf-8'; 
                    let contents: string[] = [];
                    contents.push('<!DOCTYPE html>');
                    contents.push('<html lang="en" dir="ltr"><head><meta charset="UTF-8" />');
                    contents.push('<link rel="stylesheet" type="text/css" href="/dist/markdown.min.css" />');
                    contents.push('<link rel="stylesheet" type="text/css" href="/dist/reset.min.css" />');
                    contents.push('</head><body><article class="document">');
                    contents.push('');
                    contents.push('${toc}');
                    contents.push('<section class="page" id="p1">');
                    contents.push('');
                    contents.push(document.current.contents);
                    contents.push('</section></article>');
                    contents.push('<a class="sosly-forge-logo-link" href="/" target="_blank"><img src="/assets/logo.png" alt="The Forge" /></a>');
                    contents.push('</body></html>');
                    ctx.body = md.render(contents.join('\n'));
                    break;
            }
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }
    }
}

export function setupViewerMiddleware(app: Koa, config: Config<any>): void {
    const viewer = new ViewerRouter(config);
    app.use(viewer.routes());
    app.use(viewer.allowedMethods());
}
