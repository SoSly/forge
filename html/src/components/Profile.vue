<script setup lang=ts>
import { ref } from 'vue';
import { useStore } from 'vuex';
const $store = useStore();

const user = ref($store.state.user);

</script>

<style scoped lang="scss">
section {
    margin: 25px auto 0;
    width: 8.5in;

    background: white;
    color: black;
    box-shadow: 1px 5px 15px #000;

    .left {
        border-right: 1px solid black;
        padding: 1em;
        width: 200px;

        img {
            border: 1px solid #EEE;
            display: block;
            margin: 0 auto 1em;
            width: 128px;
        }

        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
        }
    }
}

.dark section {
    background: #333; 
    color: #DDD;
    .left { border-right: 1px solid #666; }
}
</style>

<template>
<section v-if="$store.getters['user/loggedIn']">
    <div class="left">
        <img v-bind:src="$store.getters['user/avatar']" />
        <h1>{{user.displayName || user.username}}</h1>
    </div>
</section>
</template>