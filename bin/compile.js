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
import MarkdownItTOCDoneRight from 'markdown-it-toc-done-right';
import Pagebreak from '../src/pagebreak.js';
import path from 'path';
import sass from 'node-sass';
import Timer from '../src/timer.js';
import uslug from 'uslug';

const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: 'language-',
    linkfiy: false,
    typographer:  true,
    quotes: '“”‘’',
});
md.use(Pagebreak);
md.use(Columnbreak);
md.use(MarkdownItAnchor);
md.use(MarkdownItTOCDoneRight, {
    slugify: uslug
});

const docspath = path.join(process.cwd(), DOCSPATH);
const sasspath = path.join(process.cwd(), SASSPATH);
const htmlpath = path.join(process.cwd(), HTMLPATH);
const csspath  = path.join(process.cwd(), CSSPATH);

/**
 * Compiles HTML
 */
function compileHTML(docpath) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    const timer = new Timer();
    const filename = path.parse(docpath).name;
    console.debug(`compiling HTML for ${filename}.`);
    const indoc = fs.readFileSync(docpath);
    const doccontent = `<!DOCTYPE html>
<html>
    <head>
        <title>The Nivenomicon</title>
        <link rel=stylesheet type=text/css href=css/unearthed-arcana.css />
    </head>
<body>

<section class=document>

\${toc}
<section class=page>

${indoc.toString()}
</section>
</section>
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
function compileCSS(sasspath) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    const timer = new Timer();
    const filename = path.parse(sasspath).name;
    console.debug(`compiling CSS for ${filename}.`);
    const input = fs.readFileSync(sasspath);
    const outcss = sass.renderSync({data: input.toString()});
    const output = path.join(csspath, filename + '.css');
    fs.writeFileSync(output, outcss.css);
    console.log(`finished compiling CSS for ${filename} in ${timer.stop().format()}.`);
}

const docwatcher = chokidar.watch(docspath, {ignored: /^\./, persistent: true});
docwatcher
    .on('add', (path) => compileHTML(path))
    .on('change', (path) => compileHTML(path))
    .on('error', console.error);

const sasswatcher = chokidar.watch(sasspath, {ignored: /^\.|\_/, persistent: true});
sasswatcher
    .on('add', (path) => compileCSS(path))
    .on('change', (path) => compileCSS(path))
    .on('error', console.error);
