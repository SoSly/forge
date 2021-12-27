<script setup lang=ts>
import Contents from './Workbench/Contents.vue';
import Header from './Workbench/Header.vue';

import { forge } from '../types';
import { ref } from 'vue';
import { useStore } from 'vuex';

const $store = useStore();
const title = 'Your Workbench';

const folder = ref($store.state.folder);

let dragging: forge.FolderItem | undefined = undefined;
function drag(item) {
    if (dragging !== undefined) return; // todo: warning maybe?
    dragging = item;
}

async function drop(item) {
    if (!dragging) return;
    if (item.type != 'folder') return;
    switch (dragging.type) {
        case 'document':
            await $store.dispatch('document/move', {folderId: item.id, document: dragging});
            dragging = undefined;
            break;
        case 'folder':
            await $store.dispatch('folder/move', {parentId: item.id, folder: dragging});
            dragging = undefined;
            break;
    }
}
</script>

<style lang="scss">
#workbench {
    margin: 1em auto;
    max-height: calc(100vh - 64px - 2em);
    padding: 0.5in;
    width: 8.5in;
    background: #EEE;
    color: #333;
    box-shadow: 1px 5px 15px #333;

    table {
        margin-top: 1em;
        width: 100%;

        th, td {
            line-height: 1.3em;
            padding: 0 5px;
            
            &:nth-of-type(1) { width: 48%; }
            &:nth-of-type(2) { width: 27%; }
            &:nth-of-type(3) { width: 15%; }
            &:nth-of-type(4) { width: 12%; }
            &:nth-of-type(5) { width: 8%; }
        }

        td:last-of-type svg { cursor: pointer; }
        td:first-of-type span {
            display: inline-block;
            width: 1em;
            text-align: center;
        }

        thead {
            display: table;
            table-layout: fixed;
            width: calc(100% - 0.5em);

            th {
                border-right: 1px solid #CCC;
                cursor: pointer;
                font-size: 10pt;
                text-align: left;
                &:last-of-type { border-right: none; }
            }
        }

        tbody {
            border: 1px solid #CCC;
            display: block;
            height: calc(100vh - 27px - 64px - 1.5in - 2em);
            overflow-y: scroll;
            width: 7.5in;

            tr {
                display: table;
                width: 100%;
                table-layout: fixed;
                &:hover { background: #CCC; }
                &:nth-child(odd) { 
                    background: #DDD;
                    &:hover { background: #CCC; }
                }
            }

            &::-webkit-scrollbar { width: 0.5em; }
            &::-webkit-scrollbar-track { box-shadow: inset 0 0 6px #AAA; }
            &::-webkit-scrollbar-thumb { background-color: #CCC; outline: 1px solid #CCC; }
        }
    }
}

.dark #workbench {
    background: #333;
    color: #AAA;

    table thead th { border-right-color: #666; }
    tbody {
        border-color: #666;
        tr:hover { background: #555; }
        tr:nth-child(odd) { 
            background: #444; 
            &:hover { background: #555; }
        }
    }
}
</style>

<template>
    <section id="workbench" v-if="folder">
        <Header :folder="folder" @drop="drop"></Header>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Last Modified</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in $store.getters['folder/contents']" :key="`${item.type}-${item.id}`">
                    <Contents :item="item" @drag="drag" @drop="drop"></Contents>
                </template>
            </tbody>
        </table>
    </section>
</template>