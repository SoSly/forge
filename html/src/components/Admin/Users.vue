<script setup lang=ts>
import Grant from './Grant.vue';

import { computed, ref, Ref } from "vue";
import { useStore } from "vuex";
import { forge } from '../../types';

const $store = useStore();
const users = computed(() => $store.state.usersadmin.users);
const page = computed(() => $store.state.usersadmin.page);
const pages = computed(() => $store.state.usersadmin.pages);
const rights = computed(() => $store.state.user.rights);

async function grantUserRights(user: forge.User) {
    await $store.dispatch('usersadmin/grant', user);
}

function usage(amount: number) {
    let i = -1;
    const byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        amount = amount / 1024;
        i++;
    } while(amount > 1024);
    return Math.max(amount, 0.1).toFixed(1) + byteUnits[i];
}

async function banUser(user: forge.User) {
    if (confirm(`Are you sure you want to ban '${user.username} (id: ${user.id})'?`)) {
        await $store.dispatch('usersadmin/ban', user.id);
    }
}

async function deleteUser(user: forge.User) {
    if (confirm(`Are you sure you want to delete '${user.username} (id: ${user.id})' and all of their content? This action is irreversible.`)) {
        await $store.dispatch('usersadmin/delete', user.id);
    }
}

function getProviderProfileLink(user: forge.User) {
    switch (user.provider) {
        case 'discord':
            return `https://discordapp.com/users/${user.providerId}`;
    }
}

const rightsUser: Ref<forge.User | null> = ref(null);
async function setRightsUser(user: forge.User | null) {
    if (user === null) {
        await $store.dispatch('usersadmin/get', page.value);
    }
    rightsUser.value = user;
}
</script>

<style scoped lang=scss>
section#users {
    background: #EEE;
    color: black;
    position: relative;
    padding: 0.25in;
    margin: 0.25in auto;
    user-select: none;
    width: 8.5in;

    .cover {
        background: rgba(0, 0, 0, .7);
        position: fixed;
        top: 0; bottom: 0; left: 0; right: 0;
        margin: 0 auto;
        height: 100%; width: 100%;

        & > section {
            position: absolute;
            top: 0; bottom: 0; left: 0; right: 0;
            margin: 10em auto;
        }
    }
}

.dark section#users {
    background: #333;
    color: #AAA;
    tbody tr:nth-child(odd) {  background: #444; }
    thead { border-bottom: 1px solid #999; }
}

table {
    width: 100%;

    thead {
        border-bottom: 1px solid #CCC;
        display: table;
        table-layout: fixed;
        width: 100%;
        margin-bottom: 0.25em;

        th {
            font-weight: bold;
            text-align: left;
        }
    }

    tbody {
        display: block; 
        width: 100%;

        overflow-y: auto;
        
        max-height: calc(51em);
        height: calc(100vh - 15em);

        tr {
            display: table;
            table-layout: fixed;
            width: 100%;

            td {
                line-height: 1.2em;
            }

            &:nth-child(odd) { background: #DDD; }
        }

        td:last-of-type a {
            cursor: pointer;
            margin-right: 0.25em;
        }

        &::-webkit-scrollbar { width: 0.5em; }
        &::-webkit-scrollbar-track { box-shadow: inset 0 0 6px #AAA; }
        &::-webkit-scrollbar-thumb { background-color: #CCC; outline: 1px solid #CCC; }
    }

    tfoot {
        text-align: center;

        td { padding-top: 1em; }

        span {
            color: #39C;
            cursor: pointer;
            font-weight: bold;
            padding-left: 0.25em;
            padding-right: 0.25em;
            user-select: none;

            &.current {
                color: inherit;
                font-weight: bold;
            }
        }
    }
}
</style>

<template>
<section id="users">
    <aside class="cover" v-if="rightsUser !== null">
        <Grant @change="grantUserRights" @close="setRightsUser(null);" :user="rightsUser"></Grant>
    </aside>
    <table>
        <thead>
            <tr>
                <th>User</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Usage</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user.id">
                <td>{{user.username}}</td>
                <td><a :href="getProviderProfileLink(user)" target="_blank">{{user.provider}}</a></td>
                <td>{{user.type}}</td>
                <td v-if="user.usage.max !== null">{{usage(user.usage.current)}} / {{usage(user.usage.max)}}</td>
                <td v-else>{{usage(user.usage.current)}}</td>
                <td>
                    <a v-show="rights.document_list" :title="`View ${user.username}'s content`">
                        <font-awesome-icon icon="book" size="1x" />
                    </a>
                    <a v-show="rights.grant" @click="setRightsUser(user);" :title="`Grant rights to ${user.username}`">
                        <font-awesome-icon icon="list" size="1x" />
                    </a>
                    <a v-show="rights.delete_content" @click="deleteUser(user);" :title="`Delete ${user.username} and all content.`">
                        <font-awesome-icon icon="trash" size="1x" />
                    </a>
                    <a v-show="rights.ban_user" @click="banUser(user);" :title="`Ban ${user.username}`">
                        <font-awesome-icon icon="ban" size="1x" />
                    </a>                    
                </td>
            </tr>
        </tbody>
    </table>
</section>
</template>
