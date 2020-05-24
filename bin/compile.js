#!/usr/bin/env node

const DOCSPATH = "documents";
const SASSPATH = "styles";
const HTMLPATH = "public";
const CSSPATH  = "public/css";

import chokidar from 'chokidar';
import fs from 'fs';
import Columnbreak from '../src/columnbreak.js';
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import TOC from '../src/toc.js';
import Pagebreak from '../src/pagebreak.js';
import path from 'path';
import sass from 'node-sass';
import Timer from '../src/timer.js';
import uslug from 'uslug';

const md = new MarkdownIt({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkfiy: false,
    typographer: true
});
md.use(Pagebreak);
md.use(Columnbreak);
md.use(MarkdownItAnchor);
md.use(TOC, {
    slugify: uslug,
    level: [1,2,3]
});

const docspath = path.join(process.cwd(), DOCSPATH);
const sasspath = path.join(process.cwd(), SASSPATH);
const htmlpath = path.join(process.cwd(), HTMLPATH);
const csspath  = path.join(process.cwd(), CSSPATH);

/**
 * Compiles HTML
 */
function compileHTML(importpath) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    const timer = new Timer();
    const filename = path.parse(importpath).name;
    console.debug(`compiling HTML for ${filename}.`);
    const indoc = fs.readFileSync(importpath);
    const doccontent = `<!DOCTYPE html>
<html lang=en dir=ltr>
    <head>
        <meta charset="UTF-8" />
        <link rel=stylesheet type=text/css href=css/document.css />
    </head>
<body>

<article class=document>

\${toc}
<section class=page id=p1>

${indoc.toString()}
</section>
</article>
</body>
</html>`;
    const outdoc = md.render(doccontent);
    const output = path.join(htmlpath, filename + '.html');
    fs.writeFileSync(output, outdoc);
    console.log(`finished compiling HTML for ${filename} in ${timer.stop().format()}.`);
}

/**
 * Compile SCSS
 */
function compileCSS(importpath) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    const timer = new Timer();
    const filename = path.parse(importpath).name;
    console.debug(`compiling CSS for ${filename}.`);
    const input = fs.readFileSync(importpath);
    const outcss = sass.renderSync({
        data: input.toString(),
        importer: (node) => {
            const importpath = path.join(sasspath, node + '.scss');
            const input = fs.readFileSync(importpath);
            return {contents: input.toString()};
        }
    });
    const output = path.join(csspath, filename + '.css');
    fs.writeFileSync(output, outcss.css);
    console.log(`finished compiling CSS for ${filename} in ${timer.stop().format()}.`);
}

const chokidarOptions = {
    ignored: /^\.|\_/,
    persistent: true,
    ignoreInitial: true
};
const docwatcher = chokidar.watch(docspath, chokidarOptions);
docwatcher
    .on('add', (path) => compileHTML(path))
    .on('change', (path) => compileHTML(path))
    .on('error', console.error);

const sasswatcher = chokidar.watch(sasspath, chokidarOptions);
sasswatcher
    .on('add', (path) => compileCSS(path))
    .on('change', (path) => compileCSS(path))
    .on('error', console.error);
