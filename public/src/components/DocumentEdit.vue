<template>
    <section id="document-editor" v-if="document" v-shortkey.once="['ctrl','s']" @shortkey="debouncedSave" @input="input">
        <nav>
            <ul>
                <li class="button save" v-bind:class="dirty ? 'dirty' : ''" v-on:click="debouncedSave"><font-awesome-icon icon="save" size="1x" /> Save</li>
                <select v-model="document.type" v-on:change="dirty = true">
                    <option value="markdown">Markdown</option>
                    <option value="stylesheet">Stylesheet</option>
                </select>
            </ul>
            <input type="text" v-model="document.name" v-on:blur="rename($event)" />
        </nav>
        <multipane>
            <div :style="{width: '575px', minWidth: '300px', maxWidth: '900px'}">
                <div class="editor-pane">
                   <editor ref="contents" v-model="document.current.contents"
                        @init="editorInit" v-on:input="input" v-bind:lang="language" theme="monokai">
                    ></editor>
                </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div :style="{flexGrow: 1}">
                <div class="preview-pane" @click="handleClick">
                    <template v-if="this.document.type == 'stylesheet'">
                        <pre class="page">{{document.current.contents}}</pre>
                    </template>
                    <template v-if="this.document.type == 'markdown'">
                        <span id="article-styles" v-html="stylesFromMarkdown"></span>
                        <article class="document" v-html="getPreview"></article>
                    </template>
                </div>
            </div>
        </multipane>
    </section>
</template>

<script>
import {debounce, throttle} from 'lodash';
import editor from 'vue2-ace-editor';
import {mapGetters, mapState} from 'vuex';
import {Multipane, MultipaneResizer} from 'vue-multipane';

// todo: put this somewhere the frontend and the backend can both get at it.
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import Columnbreak from '../plugins/markdown/columnbreak.js';
import LineNumbers from '../plugins/markdown/injectLineNumbers';
import Pagebreak from '../plugins/markdown/pagebreak.js';
import TOC from '../plugins/markdown/toc.js';
import uslug from 'uslug';

// The number of lines that are offset by additional content wrapped around the user's document.
const LINE_NUMBER_OFFSET = 2;

const md = new MarkdownIt({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: true
});
md.use(Columnbreak);
md.use(LineNumbers);
md.use(MarkdownItAnchor);
md.use(Pagebreak);
md.use(TOC, {
    slugify: uslug,
    level: [1,2,3]
});

const reStyleSheet = new RegExp(`<link.*?rel="?stylesheet"?.*?\/>`, 'gmi');

export default {
    name: 'document-editor',
    components: {
        editor, 
        Multipane,
        MultipaneResizer
    },
    data() {
        return {
            preview: "",
            editor: null,
            dirty: false
        }
    },
    computed: {
        stylesFromMarkdown() {
            const styles = this.document.current.contents.match(reStyleSheet) || [];
            styles.unshift(`<link rel="stylesheet" type="text/css" href="/dist/markdown.min.css" />`);
            return styles.join('\n');
        },
        getPreview() {
            this.throttledCompilePreview();
            setTimeout(this.setupScrollToLine, 1);
            return this.preview;
        },
        darkmode() {
            return this.$store.state.user.user.settings.darkmode;
        },
        language() {
            return this.document.type == 'stylesheet' ? 'css' : 'markdown';
        },
        ...mapState({
            document: (state) => state.document.document
        })
    },
    created() {
        this.$store.dispatch('document/get', this.$route.params.id);
        this.throttledCompilePreview = throttle(this.compilePreview, 500);
        this.debouncedSave = debounce(this.save, 1000);
    },
    methods: {
        editorInit() {
            require('brace/ext/searchbox'); // search box prerequisite
            require('brace/ext/language_tools'); //language extension prerequsite...
            require('brace/mode/markdown');      //language
            require('brace/theme/monokai');
            
            const editor = this.$refs.contents.editor;
            editor.setOptions({
                wrapBehavioursEnabled: true,
                enableMultiselect: true,
                scrollPastEnd: 0.25,
                wrap: true,
                selectionStyle: 'text',
                highlightActiveLine: false,
                highlightSelectedWord: true,
                cursorStyle: 'smooth',
                firstLineNumber: 1
            });
        },
        scrollToLine(el) {
            const lineNumber = parseInt(el.getAttribute('data-source-line'));
            if (isNaN(lineNumber)) {
                console.warn("attempted to scroll to a non-numerical line number");
                return;
            }
            const destination = lineNumber - LINE_NUMBER_OFFSET;
            const editor = this.$refs.contents.editor;
            editor.gotoLine(destination, 0, true);
        },
        handleClick(e) {
            if (e.target.matches('.source-line')) {
                this.scrollToLine(e.target);
            }
        },
        input() {
            this.dirty = true;
            this.throttledCompilePreview();
            this.debouncedSave();
        },
        compilePreview() {
            if (!this.$store.state.document.document) return;
            const tc = this.$store.state.document.document.current.contents;
            tc.replace(reStyleSheet, '');
            const contents = [];
            contents.push('\${toc}');
            contents.push('<section class="page" id="p1">');
            contents.push('');
            contents.push(tc);
            contents.push('</section>');
            this.preview = md.render(contents.join('\n'));
        },
        async save() {
            await this.$store
                .dispatch('document/save', {
                    id: this.$route.params.id, 
                    contents: this.$store.state.document.document.current.contents,
                    name: this.$store.state.document.document.name,
                    type: this.$store.state.document.document.type,
                })
                .then(() => this.dirty = false);
        },
        rename($event) {
            const {id} = this.$route.params.id;
            const name = $event.target.value;

            this.$store
                .dispatch('document/rename', {id: this.$route.params.id, name})
                .then(() => this.dirty = false);

        }
    }
}
</script>

<style lang="scss">
#document-editor {   
    .multipane {
        .multipane-resizer {
            background: #AAA;
            height: auto; 
            left: 0;
            margin: 0;
            width: 1px;
        }
    }

    & > nav {
        background: #AAA;
        color: #333;
        height: 2em;

        input {
            background: #CCC;
            border: 1px solid #666;
            line-height: 1.4em;
            padding: 0 0.5em;
            font-weight: bold;
            width: 200px;
            text-align: center;
            margin-left: 40%;
        }

        ul {
            display: inline-block;
            padding-left: 0.5em;

            li {
                border-right: 1px solid #999;
                display: inline-block;
                padding: 0 0.25em 0;
                position: relative;
                &:first-of-type { border-left: 1px solid #999; }
                line-height: 2em;
                
                a {
                    color: #39C;
                }

                &.button {
                    cursor: pointer; 
                    &:hover {
                        background: #BBB;
                        color: #111;
                    }

                    &.save.dirty { 
                        background: #C33; 
                        &:hover { color: white; }
                    }
                }
            }
        }
    }

    .ace_editor { min-height: calc(100vh - 64px - 2em); }

    .preview-pane {
        height: calc(100vh - 64px - 2em);
        overflow-y: scroll;
        width: 100%;

        .page {
            margin: 1em auto;
            max-width: 100%;
            padding: 0.5in;
            width: 8.5in;
        }

        pre {
            color: black;
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -pre-wrap;
            white-space: -o-pre-wrap;
            word-wrap: break-word;
        }
    }
}

.page { 
    background: white; 
}
</style>
