<template>
    <section id="workbench" v-if="loggedIn">
        <nav>
            <ul>
                <li><router-link to="workbench">home-icon-here</router-link></li>
                <li v-for="path in folder.path" :key="path.id">
                    <router-link :to="{path: `workbench/${path.id}`}">{{path.name}}</router-link>
                </li>
                <li class="current">{{folder.name}}</li>
            </ul>
        </nav>
        <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Last Modified</th>
                <th>Type</th>
                <th>Size</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in folder.children" :key="item.id">
                <td>{{item.name}}</td>
                <td>{{lastModified(item.lastModified)}}</td>
                <td>{{type(item.type)}}</td>
                <td>{{size(item.size)}}</td>
            </tr>
        </tbody>
        </table>
    </section>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

const typeMap = {
    'folder': {name: 'File Folder'},
    'document': {name: 'Document'},
    'image': {name: 'Image'},
}

export default {
    name: 'workbench',
    computed: {
        ...mapState({
            loggedIn: (state) => state.user.loggedIn,
            folder: (state) => state.folder.folder
        }),
        ...mapGetters({
        })
    },
    methods: {
        lastModified(timestamp) { 
            timestamp = Math.floor(Math.random() * timestamp);
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
    margin: 0 auto;
    width: 8.5in;

    nav {
        margin-top: 1em;
        ul {
            li {
                display: inline-block;
                &:before { content: '/'; padding: 0.25em; }
                &:first-of-type:before { display: none; }
                a {
                    color: #08C;
                }
            }
        }
    }    

    table {
        margin-top: 1em;
        width: 100%;

        th, td { 
            line-height: 1.1em; 
            padding: 0 5px;
        }

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
</style>
