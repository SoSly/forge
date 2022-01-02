<script setup lang=ts>
import { computed } from 'vue';
import { useStore } from 'vuex';

const $store = useStore();

const entries = computed(() => $store.state.auditlog.entries);
const page = computed(() => +$store.state.auditlog.page);
const pages = computed(() => +$store.state.auditlog.pages);

function date(time) {
    return new Date(time).toLocaleString('en-US');
}

async function goto(page) {
    await $store.dispatch('auditlog/get', page);
}
</script>

<style scoped lang=scss>
section {
    background: #EEE;
    color: #333;
    padding: 0.25in;
    margin: 0.25in auto;
    user-select: none;
    width: 8.5in;
}

table {
    width: 100%;

    thead {
        border-bottom: 1px solid #CCC;
        display: table;
        table-layout: fixed;
        width: 100%;

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

            &:nth-child(odd) { background: #DDD; }
        }

        &::-webkit-scrollbar { width: 0.5em; }
        &::-webkit-scrollbar-track { box-shadow: inset 0 0 6px #AAA; }
        &::-webkit-scrollbar-thumb { background-color: #CCC; outline: 1px solid #CCC; }
    }

    th, td {
        &:nth-of-type(1) { width: 20%; }
        &:nth-of-type(2) { width: 10%; }
        &:nth-of-type(3) { width: 20%; }
        &:nth-of-type(4) { width: 10%; }
        &:nth-of-type(5) { width: 10%; }
        &:nth-of-type(6) { width: 30%; }
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

.dark section {
    background: #333;
    color: #AAA;
    tbody tr:nth-child(odd) {  background: #444; }
    thead { border-bottom: 1px solid #999; }
}
</style>

<template>
<section>
<table>
    <thead>
        <tr>
            <th>Date</th>
            <th>Admin</th>
            <th>Action</th>
            <th>User</th>
            <th>Detail</th>
            <th>Note</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="entry in entries" :key="entry.id">
            <td>{{date(entry.createdAt)}}</td>
            <td>{{entry.user.username}}</td>
            <td>{{entry.action}}</td>
            <td>{{entry.affected_user.username}}</td>
            <td>{{entry.detail}}</td>
            <td>{{entry.note}}</td>
        </tr>
    </tbody>
    <tfoot v-if="pages > 1">
        <tr>
            <td colspan="6">
                <template v-if="page > 1">
                    <span @click="goto(page - 1);">&laquo;</span>
                    <span @click="goto(1);">1</span>
                    &hellip;
                </template>
                <template v-else>
                    <span style="visibility: hidden;">&laquo;</span>
                    <span style="visibility: hidden;">&hellip; 1</span>
                </template>
                <span class="current">{{page}}</span>
                <template v-if="page < pages">
                    &hellip;
                    <span @click="goto(pages)">{{pages}}</span>
                    <span @click="goto(page + 1)">&raquo;</span>
                </template>
                <template v-else>
                    <span style="visibility: hidden;">&hellip; {{pages}}</span>
                    <span style="visibility: hidden;">&raquo;</span>
                </template>
            </td>
        </tr>
    </tfoot>
</table>
</section>
</template>