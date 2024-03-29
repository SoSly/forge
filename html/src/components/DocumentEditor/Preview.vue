<script setup lang=ts>
import { forge } from '../../types';
import { computed, ref } from 'vue';

import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import columnbreakPlugin from '../../plugins/markdown/columnbreak';
import injectLineNumbersPlugin from '../../plugins/markdown/injectLineNumbers';
import pagebreakPlugin from '../../plugins/markdown/pagebreak';
import tocPlugin from '../../plugins/markdown/toc';
import uslug from 'uslug';

const props = defineProps<{document: forge.Document}>();
const emits = defineEmits(['scroll'])

const md = new MarkdownIt({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: true
});
md.use(MarkdownItAnchor);
md.use(columnbreakPlugin);
md.use(injectLineNumbersPlugin, {offset: -2});
md.use(pagebreakPlugin);
md.use(tocPlugin, {
    slugify: uslug,
    level: [1,2,3,4]
});


function handleClick($event) {
    if ($event.target.matches('.source-line')) {
        emits('scroll', $event.target);
    }
}

const reStyleSheet = new RegExp(`<link.*?rel="?stylesheet"?.*?\/>`, 'gmi');
const stylesheets = computed(() => {
    const styles = props.document.current.contents.match(reStyleSheet) ?? [];
    styles.unshift(`<link rel="stylesheet" type="text/css" href="/dist/markdown.min.css" />`);
    return styles.join('\n');
});

const contents = computed(() => {
        const contents: string[] = [];
        const tc = props.document.current.contents
        tc.replace(reStyleSheet, '');
        contents.push('\${toc}');
        contents.push('<section class="page" id="p1">\n');
        contents.push(tc);
        contents.push('</section>');
        return md.render(contents.join('\n'));
});
</script>

<style lang=scss>
@import '../../styles/page.scss';

#preview-pane {
    margin-left: 580px;
    overflow-y: scroll;
    height: calc(100vh - 65px - 2em);
    width: calc(100vw - 580px);

    pre {
        background: white;
        color: black;
        margin: 0.25in auto;
        padding: 0.5in;
        width: 8.5in;
    }
}
</style>

<template>
<div id="preview-pane" @click="handleClick">
    <template v-if="document.type == 'markdown'">
        <span v-html="stylesheets"></span>
        <article class="document" v-html="contents"></article>
    </template>
    <template v-if="document.type === 'stylesheet'">
        <pre>{{document.current.contents}}</pre>
    </template>
</div>
</template>