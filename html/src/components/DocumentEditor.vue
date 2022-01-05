<script setup lang=ts>
import Editor from './DocumentEditor/Editor.vue';
import Header from './DocumentEditor/Header.vue';
import Preview from './DocumentEditor/Preview.vue';

import { debounce } from 'lodash';
import { forge } from '../types';
import { ref } from 'vue';
import { useStore } from 'vuex';

const $store = useStore();
const title = 'Editor';

const dirty = ref(false);
const document = ref($store.state.document);

const save = debounce(async function() {
    await $store.dispatch('document/save');
    dirty.value = false;
}, 1000);

function change() {
    dirty.value = true;
    save();
}

let ed;
function editor(instance) {
    ed = instance;
}

function scroll(el: HTMLElement) {
    const dsl = el.getAttribute('data-source-line');
    if (dsl === null) return;
    const lineNumber = parseInt(dsl);
    if (isNaN(lineNumber)) return;
    ed.gotoLine(lineNumber, 0, true);
}
</script>

<template>
<section id="document-editor" v-if="document">
    <Header :document="document" :dirty="dirty" @save="save" @change="change"></Header>
    <Editor :document="document" @editor="editor" @save="save" @change="change"></Editor>
    <Preview :document="document" @scroll="scroll"></Preview>
</section>
</template>