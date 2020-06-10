<template>
    <section id="workbench" v-if="folder">
        <nav>
            <ul>
                <li class="new-folder">
                    <span v-on:click="createNewFolder">
                        <font-awesome-icon icon="folder" size="1x" /> New Folder
                    </span>
                </li>
                <li class="new-document">
                    <font-awesome-icon icon="file-alt" size="1x" /> New Document
                </li>
            </ul>
            <ul>
                <li><router-link to="/workbench">
                    <font-awesome-icon icon="home" size="1x" />
                </router-link></li>
                <template v-if="path">
                <li v-for="path in path" :key="path.id">
                    <router-link :to="{path: `/workbench/${path.id}`}">{{path.name}}</router-link>
                </li>
                </template>
                <li v-if="folder.id != $store.state.user.user.id" class="current">
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
                <th v-on:click="sortBy('name')">Name</th>
                <th>Last Modified</th>
                <th>Type</th>
                <th>Size</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in folder.children" :key="item.id">
                <td><router-link :to="{path: `/workbench/${item.id}`}">{{item.name}}</router-link></td>
                <td>{{lastModified(item.updatedAt)}}</td>
                <td></td>
                <td></td>
                <td>
                    <font-awesome-icon icon="trash" size="1x" v-on:click="deleteFolder(item.id)" />
                </td>
            </tr>
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
}

export default {
    name: 'workbench',
    data() {
        return {
            editFolder: false,
            newMenu: false
        }
    },
    computed: {
        ...mapState({
            loggedIn: (state) => state.user.loggedIn,
            folder: (state) => state.folder.folder
        }),
        path() {
            if (this.folder && this.folder.parent) {
                if (this.folder.parent.id === this.$store.state.user.user.id) return;
                const {id, name} = this.folder.parent
                return [{id, name}];
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
        createNewFolder() {
            const {id} = this.$store.state.folder.folder;
            this.$store.dispatch('folder/createFolder', {parentId: id, name: 'New Folder'});
        },
        deleteFolder(id) {
            this.$store.dispatch('folder/deleteFolder', id);
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
        sortBy(field) {
            if (this.folder) {
                this.folder.children = this.folder.children.sort((a, b) => {
                    return ('' + a[field]).localeCompare(b[field]);
                })
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
    },
    mounted() {
        this.sortBy('name');
    }
}
</script>

<style lang="scss">
#workbench {
    margin: 0 auto;
    width: 8.5in;

    nav {
        padding-bottom: 0.5em;
        border-bottom: 2px solid #EEE;
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
                &:before { content: '/'; padding: 0.25em; }
                &:first-of-type:before { display: none; }
                a {
                    color: #08C;
                }
            }
        }
    }

    a {
        color: #08C;
        text-decoration: none;
        &:hover { text-decoration: underline; }
    }

    table {
        margin-top: 1em;
        width: 100%;

        th, td { 
            line-height: 1.2em; 
            padding: 0 5px;
        }
        
        td:last-of-type svg { cursor: pointer; }

        thead {
            border-bottom: 1px solid rgba(0,0,0,.025);

            th {
                border-right: 1px solid #EEE;
                color: #AAA;
                font-size: 10pt;
                text-align: left;
                &:last-of-type { border-right: none; }
            }
        }
    }
}

.dark #workbench {
    nav {
        border-bottom: 2px solid #666;
    }
    table {
        thead { 
            border-bottom: 1px solid rgba(255,255,255,.025); 
            th {
                border-right: 1px solid #666;
                &:last-of-type { border-right: none; }
            }
        }
    }
}
</style>
