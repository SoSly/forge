<script setup lang=ts>
import ContentRow from '../Workbench/Contents.vue';

import { computed, Ref } from "vue";
import { useStore } from 'vuex';
import { forge } from '../../types';

const props = defineProps<{user: forge.User}>();
const emits = defineEmits(['close']);

const $store = useStore();

const contents = computed(() => $store.state.contentadmin.contents);
const page = computed(() => $store.state.contentadmin.page);
const pages = computed(() => $store.state.contentadmin.pages);
</script>

<style scoped lang=scss>
section {
    background: #EEE;
    border: 1px solid #AAA;
    max-height: 7.5in;
    width: 6.5in;

    header {
        background: rgba(0, 0, 0, .2);
        font-weight: bold;
        font-size: 1.2em;
        line-height: 1.2em;
        padding: 0.1in 0.25in 0.05in;

        span {
            color: #C00;
            cursor: pointer;
            float: right;
        }
    }

    table {
        margin: 0.5em;
        thead tr { background: transparent !important; }
        th { 
            text-align: left; 
                
            &:nth-of-type(1) { width: 48%; }
            &:nth-of-type(2) { width: 27%; }
            &:nth-of-type(3) { width: 15%; }
            &:nth-of-type(4) { width: 12%; }
            &:nth-of-type(5) { width: 8%; }
        }

        tr {
            display: table;
            width: 100%;
            table-layout: fixed;
        }
    }
}

.dark section {
    background: #333;
    border: 1px solid #666;

    tr:nth-child(odd) { 
        background: #444; 
        &:hover { background: #555; }
    }
}
</style>

<template>
<section>
    <header>
        Content by {{user.username}}
        <span @click="emits('close');">
            <font-awesome-icon icon="times" size="1x"></font-awesome-icon>
        </span>
    </header>
    <table>
        <thead>
            <tr>
                <th>Document</th>
                <th>Last Modified</th>
                <th>Type</th>
                <th>Size</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="item in contents" :key="`${item.type}-${item.id}`">
                <ContentRow :item="item"></ContentRow>
            </template>
        </tbody>
    </table>
</section>
</template>