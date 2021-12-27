import {Config} from 'convict';
import Router from '@koa/router';
import Koa, {Context, Next} from 'koa';
import {AbstractRouter} from './AbstractRouter';
import { forge } from 'types';

// todo: put this somewhere the frontend and backend can both get at it.
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import Columnbreak from '../../../html/src/plugins/markdown/columnbreak';
import Pagebreak from '../../../html/src/plugins/markdown/pagebreak';
import TOC from '../../../html/src/plugins/markdown/toc';
import uslug from 'uslug';
import {readFile} from 'fs/promises';

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

async function getCSSDocuments(): Promise<string[]> {
    const bytes = await readFile('html/dist/manifest.json');
    const manifest = JSON.parse(bytes.toString());
    return manifest['index.html'].css;
}

class ViewerRouter extends AbstractRouter {
    private config: forge.Config;

    constructor (config: forge.Config) {
        super();

        this.config = config;

        // configure routes
        this.router = new Router();
        this.router.get('/view/:id', this.getDocument);
        this.router.get('/view/document/:id', this.getDocument);
    }

    private async getDocument(ctx: Context, next: Next): Promise<void> {
        try {
        // .forEach(filename => contents.push(`<link rel="stylesheet" type="text/css" href="/dist/${filename}" />`));
        }
        catch (err) {
            console.error(err);
        }


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
                    contents.push('<title>' + document.name + '</title>');
                    contents.push('<link rel="stylesheet" type="text/css" href="/reset.css" />');
                    (await getCSSDocuments()).forEach(file => contents.push(`<link rel="stylesheet" type="text/css" href="/${file}" />`));
                    contents.push(`<meta property="og:title" content="${document.name}" />`);
                    contents.push(`<meta property="og:site_name" content="Document Forge" />`);
                    contents.push(`<meta property="og:image" content="https://forge.sosly.org/logo.png" />`);
                    contents.push('</head><body><article class="document">');
                    contents.push('');
                    contents.push('${toc}');
                    contents.push('<section class="page" id="p1">');
                    contents.push('');
                    contents.push(document.current.contents);
                    contents.push('</section></article>');
                    contents.push('<a class="sosly-forge-logo-link" href="/" target="_blank"><img src="/logo.png" alt="The Forge" /></a>');
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

export function setupViewerMiddleware(app: Koa, config: forge.Config): void {
    const viewer = new ViewerRouter(config);
    app.use(viewer.routes());
    app.use(viewer.allowedMethods());
}
