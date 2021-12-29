<script setup lang=ts>
import { forge } from '../../types';
const props = defineProps<{document: forge.Document, dirty: boolean}>();
const emits = defineEmits(['change', 'save']);
</script>

<style scoped lang=scss>
nav {
    background: #AAA;
    color: #333;
    height: 2em;
    width: 100%;

    input { 
        background: #CCC;
        border: 1px solid #666;
        display: block;
        position: relative;
        line-height: 1.4em;
        padding: 0 0.5em;
        font-weight: bold;
        width: 200px;
        text-align: center;
        margin: 0 auto;
        top: 0.3em;
    }

    ul {
        display: block;
        float: left;
        padding-left: 0.5em;

        li {
            border-right: 1px solid #999;
            display: inline-block;
            padding: 0 0.25em;
            position: relative;
            &:first-of-type { border-left: 1px solid #999; }
            line-height: 2em;

            a {
                color: #39C;
            }

            &.button {
                cursor: pointer;

                &:hover {
                    background: #BBB;
                    color: #111;
                }

                &.save.dirty {
                    background: #C33;
                    &:hover { color: white; }
                }
            }
        }
        
        select {
            margin-left: 0.25em;
        }
    }
}
</style>

<template>
<nav>
    <ul>
        <li class="button save" :class="dirty ? 'dirty' : ''" @click="emits('save')">
            <font-awesome-icon icon="save" size="1x" /> Save
        </li>
        <select v-model="document.type" @change="emits('change')">
            <option value="markdown">Markdown</option>
            <option value="stylesheet">Stylesheet</option>
        </select>
    </ul>
    <input type="text" v-model="document.name" @blur="emits('change')" @keydown.enter="$event.target.blur()" />
</nav>
</template>