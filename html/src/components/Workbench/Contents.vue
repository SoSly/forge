<script setup lang=ts>
import { forge } from '../../types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref } from 'vue';
import document from '../../../../mock/document';

const $router = useRouter();
const $store = useStore();
const props = defineProps<{item: forge.FolderItem}>();
const emits = defineEmits(['drag', 'drop']);

const typeMap = {
    'folder': {name: 'File Folder'},
    'document': {name: 'Document'},
    'image': {name: 'Image'},
};

async function deleteDocument(document: forge.FolderItem) {
    if (confirm(`Are you sure you want to delete '${document.name}' and all of its revisions?  This action is irreversible.`)) {
        await $store.dispatch('document/delete', document.id);
    }
}

async function deleteFolder(folder: forge.FolderItem) {
    if (confirm(`Are you sure you want to delete '${folder.name}' and ${size(folder.size)} of contents?  This action is irreversible.`)) {
        await $store.dispatch('folder/delete', folder.id);
    }
}

function lastModified(time) {
    return new Date(time).toLocaleString('en-US');
}

function size(size) {
    if (isNaN(size)) return;

    let i = -1;
    const byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        size = size / 1024;
        i++;
    } while(size > 1024);
    return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
}

function dragStart($event, item) {
    console.log(item.id);
}

function drop($event, item) {
    console.log(item.id);
}

function type(type) {
    return typeMap[type].name;
}
</script>

<template>
<tr draggable="true" @dragstart="emits('drag', item)" @drop="emits('drop', item)" @dragover.prevent @dragenter.prevent>
    <td v-if="item.type === 'folder'">
        <router-link :to='{path: `/workbench/${item.id}`}' class="drop-zone">
            <span><font-awesome-icon icon="folder" size="1x" /></span> {{item.name}}
        </router-link>
    </td>
    <td v-if="item.type === 'document'">
        <router-link :to='{path: `/document/edit/${item.id}`}'>
            <span><font-awesome-icon icon="file-alt" size="1x" /></span> {{item.name}}
        </router-link>
    </td>
    <td>{{lastModified(item.updatedAt)}}</td>
    <td>{{type(item.type)}}</td>
    <td>{{size(item.size)}}</td>
    <td>
        <template v-if="item.type == 'document'">
            <a @click="deleteDocument(item);" :title="`Delete ${item.name}`">
                <font-awesome-icon icon="trash" size="1x" />
            </a>
            <a :href="`/view/${item.id}`" target="_blank" :title="`View ${item.name}`">
                <font-awesome-icon icon="eye" size="1x" />
            </a>
        </template>
        <template v-if="item.type == 'folder'">
            <a @click="deleteFolder(item);" :title="`Delete ${item.name}`">
                <font-awesome-icon icon="trash" size="1x" />
            </a>
        </template>
    </td>
</tr>
</template>