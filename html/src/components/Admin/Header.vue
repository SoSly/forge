<script setup lang=ts>
import { useStore } from 'vuex';
const $store = useStore();
</script>

<style lang=scss scoped>
nav {
    user-select: none;
    background: #AAA;
    color: #333;
    height: 2em;
    width: 100%;

    ul {
        display: block;
        text-align: center;
        width: 100%;        

        li {
            &:first-of-type { border-left: 1px solid #999; }
            border-right: 1px solid #999;
            display: inline-block;
        

            a {
                color: #333;
                display: inline-block;
                padding: 0 1em;
                line-height: 2em;
                width: 100%;
            }

            &.button {
                cursor: pointer;
                &:hover {
                    a { 
                        background: #BBB;
                        color: #111; 
                    }
                }

                a.router-link-exact-active {
                    background: #38C;
                    color: white;
                }
            }
        }
    }
}
</style>

<template>
<nav>
    <ul>
        <li class="button" v-if="$store.state.user.rights.audit">
            <router-link to="/admin">Audit</router-link>
        </li>
        <li class="button" v-if="$store.state.user.rights.user_list">
            <router-link to="/admin/users">Users</router-link>
        </li>
    </ul>
</nav>
</template>
