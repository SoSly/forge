<script setup lang=ts>
import { forge } from '../../types';
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-monokai';

const props = defineProps<{document: forge.Document}>();
const emits = defineEmits(['editor', 'change', 'save']);

function init(ed) {
    ed.setOptions({
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
    emits('editor', ed);
}

function language() {
    return props.document.type == 'stylesheet' ? 'css' : 'markdown';
}
</script>

<style lang=scss>
#document-editor .ace_editor {
    display: block;
    float: left;
    min-height: calc(100vh - 69px - 2em); 
    min-width: 580px;
    max-width: calc(100vh - 8.5in);
}
</style>

<template>
<v-ace-editor v-model:value="document.current.contents" :lang="language()" theme="monokai"
    @change="emits('change')"
    @init="init"
    v-shortkey.once="['ctrl', 's']"
    v-shortkey="emits('save')" />
</template>