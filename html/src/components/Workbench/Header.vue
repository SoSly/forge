<script setup lang=ts>
import { forge } from '../../types';
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $router = useRouter();
const $store = useStore();

const props = defineProps<{folder: forge.Folder}>();
const emits = defineEmits(['drop']);

const folderNameEditor = ref(false);
function getFolderNameEditor(): HTMLInputElement | null {
    return document.getElementById('folderNameEditor') as HTMLInputElement;
}

function editFolderName() {
    folderNameEditor.value = true;
    nextTick(() => getFolderNameEditor()?.focus());
}

async function saveFolderName() {
    await $store.dispatch('folder/save');
    folderNameEditor.value = false;
}

async function createFolder() {
    const newFolder = await $store.dispatch('folder/create', {parentId: props.folder.id, name: 'New Folder'});
    $router.replace(`/workbench/${newFolder.id}`);
}

async function createDocument() {
    const newDocument = await $store.dispatch('document/create', {folderId: props.folder.id, name: 'New Document'});
    $router.push(`/document/edit/${newDocument.id}`);
}

function generatePath(folder: forge.NodeFolder, path: forge.FolderItem[]) {
    if (!folder.parent) {
        return path;
    }

    if (path.length > 1) {
        path.unshift({id: '...', name: '...'} as forge.FolderItem);
        return path;
    }

    if (folder !== $store.state.folder) {
        path.unshift({...folder, type: 'folder'});
    }

    return generatePath(folder.parent, path);
}

function getRootFolder(folder: forge.NodeFolder): forge.FolderItem {
    if (!folder.parent) {
        return {...folder, type: 'folder'};
    }

    return getRootFolder(folder.parent);
}

const path: forge.NodeFolder[] = generatePath(props.folder, []);
</script>

<style lang=scss>
#workbench nav {
    padding-bottom: 0.5em;
    border-bottom: 2px solid #DDD;
    margin-top: 1em;
    min-height: 1.3em;
    ul {
        &:first-of-type {
            float: right;
            li {
                cursor: pointer;
                display: inline-block;
                padding-left: 1em;
            }
        }
        &:last-of-type > li {
            display: inline-block;
            position: relative;
            > div { display: inline-block; }
            &:before { content: '/'; padding: 0.25em; }
            &:first-of-type:before { display: none; }
        }
    }
}

.dark #workbench nav {
    border-bottom: 2px solid #666;
}
</style>

<template>
<nav>
    <ul>
        <li class="new-folder">
            <a title="Create a new folder" @click="createFolder">
                <font-awesome-icon icon="folder" size="1x" /> New Folder
            </a>
        </li>
        <li class="new-document">
            <a title="Create a new document" @click="createDocument">
                <font-awesome-icon icon="file-alt" size="1x" /> New Document
            </a>
        </li>
    </ul>
    <ul>
        <li @drop="emits('drop', getRootFolder(folder))" @dragover.prevent @dragenter.prevent><router-link to="/workbench">
            <font-awesome-icon icon="home" size="1x" />
        </router-link></li>
        <template v-if="path.length > 0">
            <li v-for="pathPart in path" :key="pathPart.id">
                <template v-if="pathPart.id != '...'">
                    <router-link :to="{path: `/workbench/${pathPart.id}`}" @drop="emits('drop', pathPart)" @dragover.prevent @dragenter.prevent>
                        {{pathPart.name}}
                    </router-link>
                </template>
                <template v-else>
                    <span>{{pathPart.name}}</span>
                </template>
            </li>
        </template>
        <li v-if="$store.state.folder.parent !== null" class="current">
            <input id="folderNameEditor" v-show="folderNameEditor" type="text" v-model="folder.name" 
                @blur="saveFolderName" 
                @keydown.enter="$event.target.blur()" 
            />
            <span v-show="!folderNameEditor" @dblclick="editFolderName()">
                {{folder.name}}
                <font-awesome-icon icon="pencil-alt" size="1x" @click="editFolderName()" />
            </span>
        </li>
    </ul>
</nav>
</template>