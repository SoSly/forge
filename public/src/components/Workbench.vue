<template>
    <section id="workbench" v-if="folder">
        <nav>
            <ul>
                <li class="new-folder" v-on:click="createNewFolder">
                    <font-awesome-icon icon="folder" size="1x" /> New Folder
                </li>
                <li class="new-document" v-on:click="createNewDocument">
                    <font-awesome-icon icon="file-alt" size="1x" /> New Document
                </li>
            </ul>
            <ul>
                <li><router-link to="/workbench">
                    <drop v-on:drop="setItemParent($store.state.user.user.id, ...arguments)">
                        <font-awesome-icon icon="home" size="1x" />
                    </drop>
                </router-link></li>
                <template v-if="path">
                <li v-for="path in path" :key="path.id">
                    <drop v-on:drop="setItemParent(path.id, ...arguments)">
                        <router-link :to="{path: `/workbench/${path.id}`}">{{path.name}}</router-link>
                    </drop>
                </li>
                </template>
                <li v-if="folder.parent !== null" class="current">
                    <input v-show="editFolder" ref="editFolderName" type="text" v-bind:value="folder.name" 
                        v-on:blur="saveFolderName($event)" 
                        v-on:keyup.enter="$event.target.blur()"
                        />
                    <span v-show="!editFolder" v-on:dblclick="editFolderName">
                        {{folder.name}}
                        <font-awesome-icon icon="pencil-alt" size="1x" v-on:click="editFolderName" />
                    </span>
                </li>
            </ul>
        </nav>
        <table>
        <thead>
            <tr>
                <th v-on:click="sortBy = 'name'">Name</th>
                <th v-on:click="sortBy = 'updatedAt'">Last Modified</th>
                <th v-on:click="sortBy = 'type'">Type</th>
                <th>Size</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <template v-for="item in contents">
            <drag :transfer-data="item">
                <drop v-on:drop="setItemParent(item.id, ...arguments)">
                    <tr>
                        <td v-if="item.type === 'folder'">
                            <router-link :to="{path: `/workbench/${item.id}`}">
                                <span><font-awesome-icon icon="folder" size="1x" /></span> {{item.name}}
                            </router-link>
                        </td>
                        <td v-if="item.type === 'document'">
                            <router-link :to="{path: `/document/edit/${item.id}`}">
                                <span><font-awesome-icon icon="file-alt" size="1x" /></span> {{item.name}}
                            </router-link>
                        </td>
                        <td>{{lastModified(item.updatedAt)}}</td>
                        <td>{{type(item.type)}}</td>
                        <td></td>
                        <td>
                            <a><font-awesome-icon icon="trash" size="1x" v-on:click="deleteItem(item)" /></a>
                            <router-link :to="{path: `/document/view/${item.id}`}">
                                <font-awesome-icon icon="eye" size="1x" />
                            </router-link>
                        </td>
                    </tr>
                </drop>
            </drag>
            </template>
        </tbody>
        </table>
    </section>
</template>

<script>
import _ from 'lodash';
import {mapGetters, mapState} from 'vuex';
import ClickOutside from 'vue-click-outside';
import Vue from 'vue';

const typeMap = {
    'folder': {name: 'File Folder'},
    'document': {name: 'Document'},
    'image': {name: 'Image'},
};

function generatePath(folder, path) {
    path = path || [];
    if (folder && folder.parent) {
        const {id, name} = folder.parent;
        path.unshift({id, name});
        return generatePath(folder.parent, path);
    }
    else if (folder) return path;
}

export default {
    name: 'workbench',
    data() {
        return {
            editFolder: false,
            newMenu: false,
            sortBy: 'name'
        }
    },
    computed: {
        ...mapState({
            loggedIn: (state) => state.user.loggedIn,
            folder: (state) => state.folder.folder
        }),
        contents() {
            const folders = this.folder.children.map((child) => { child.type = 'folder'; return child; });
            const documents = this.folder.documents.map((doc) => { doc.type = 'document'; return doc; });
            const contents = [...folders, ...documents].sort(this.sortContents);
            return contents;
        },
        path() {
            if (this.folder) {
                const path = generatePath(this.folder);
                path.shift();
                return path;
            }
        }
    },
    created() {
        this.$store.dispatch('folder/getFolder', this.$route.params.id);
    },
    watch: {
        $route(to, from) {
            this.$store.dispatch('folder/getFolder', this.$route.params.id);
        }
    },
    directives: {
        ClickOutside
    },
    methods: {
        createNewDocument() {
            const {id} = this.folder;
            this.$store.dispatch('document/createDocument', {folderId: id, name: 'New Document'})
                .then(({data}) => this.$store.dispatch('folder/getFolder', this.$route.params.id));
        },
        createNewFolder() {
            const {id} = this.folder;
            this.$store.dispatch('folder/createFolder', {parentId: id, name: 'New Folder'})
                .then(({data}) => this.$router.push(`/workbench/${data.id}`));
        },
        deleteItem(item) {
            this.$store.dispatch(`${item.type}/delete`, item.id)
                .then(({data}) => this.$store.dispatch('folder/getFolder', this.$route.params.id));
        },
        editFolderName() {
            this.editFolder = true;
            Vue.nextTick(() => {
                this.$refs.editFolderName.focus();
            });
        },
        hideNewMenu() {
            this.newMenu = false;
        },
        showNewMenu() {
            this.newMenu = true;
        },
        saveFolderName($event) {
            const {id} = this.$store.state.folder.folder;
            const name = $event.target.value;
            this.$store.dispatch('folder/patchFolder', {id, name});
            this.editFolder = false;
        },
        setItemParent(id, item) {
            switch (item.type) {
                case 'document':
                    this.$store.dispatch('document/setFolder', {id: item.id, folderId: id})
                        .then(({data}) => this.$store.dispatch('folder/getFolder', this.$route.params.id));
                        break;
                case 'folder':
                    this.$store.dispatch('folder/setParent', {id: item.id, parentId: id})
                        .then(({data}) => this.$store.dispatch('folder/getFolder', this.$route.params.id));
                        break;
            }
        },
        sortContents(a, b) {
            switch (this.sortBy) {
                case 'updatedAt': return a[this.sortBy] - b[this.sortBy];
                default: return ('' + a[this.sortBy]).localeCompare(b[this.sortBy]);
            }
        },
        lastModified(timestamp) {
            return new Date(timestamp).toLocaleString('en-US');
        },
        type(type) {
            return typeMap[type].name;
        },
        size(size) {
            if (isNaN(size)) return;

            let i = -1;
            const byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
            do {
                size = size / 1024;
                i++;
            } while(size > 1024);
            return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
        }
    }
}
</script>

<style lang="scss">
#workbench {
    background: #EEE;
    margin: 0 auto;
    max-height: calc(100vh - 48px);
    padding: 0.5in;
    width: 8.5in;

    nav {
        padding-bottom: 0.5em;
        border-bottom: 2px solid #DDD;
        margin-top: 1em;
        ul {
            &:first-of-type {
                float: right;
                li {
                    cursor: pointer;
                    display: inline-block;
                    padding-left: 0.5em;
                }
            }
            &:last-of-type > li {
                display: inline-block;
                position: relative;
                > div { display: inline-block; }
                &:before { content: '/'; padding: 0.25em; }
                &:first-of-type:before { display: none; }
                a {
                    color: #39C;
                }
            }
        }
    }

    a {
        color: #39C;
        text-decoration: none;
    }

    table {
        margin-top: 1em;
        width: 100%;

        th, td { 
            line-height: 1.2em; 
            padding: 0 5px;

            &:nth-of-type(1) { width: 50%; }
            &:nth-of-type(2) { width: 27%; }
            &:nth-of-type(3) { width: 15%; }
            &:nth-of-type(4) { width: 10%; }
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
                border-right: 1px solid #DDD;
                color: #AAA;
                cursor: pointer;
                font-size: 10pt;
                text-align: left;
                &:last-of-type { border-right: none; }
            }
        }

        tbody {
            border: 1px solid #DDD;
            display: block;
            height: calc(100vh - 27px - 48px - 1.5in);    
            overflow-y: scroll;
            width: 7.5in;

            div[draggable]:nth-child(odd) { background: #E0E0E0; }

            tr {
                display: table;
                width: 100%;
                table-layout: fixed;

                &:hover { background: #DDD; }
            }

            &::-webkit-scrollbar { width: 0.5em; }
            &::-webkit-scrollbar-track { box-shadow: inset 0 0 6px #AAA; }
            &::-webkit-scrollbar-thumb { background-color: #CCC; outline: 1px solid #CCC; }

        }
    }
}

.dark #workbench {
    background: #444;
    nav {
        border-bottom: 2px solid #666;
    }
    table {
        thead { 
            th {
                border-right: 1px solid #666;
                &:last-of-type { border-right: none; }
            }
        }

        tbody {
            border: 1px solid #666;
            div[draggable]:nth-child(odd) { background: #3F3F3F; }
            tr:hover { background: #555; }
        }
    }
}
</style>
