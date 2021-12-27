<script setup>
import Header from './Header.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const $route = useRoute();
const $store = useStore();

$store.dispatch('user/get');
</script>

<style lang="scss">
body#app { min-height: 100%; overflow: hidden; }
body#app { font-size: 11pt; }
body#app > article {
  background: white;
  color: black;
  min-height: 100vh;

  a, a:visited { color: #39C; text-decoration: none; }

  & > main {
    background: rgba(51, 153, 204, 0.3);
    min-height: 100vh;
    padding-top: 64px;
  }

  &.dark {
    background: #333;
    color: #DDD;
  }
}
</style>

<template>
<article v-bind:class="$store.getters['user/darkmode'] ? 'dark' : 'light'">
  <Header></Header>
  <main><router-view :key="$route.fullPath"></router-view></main>
</article>
</template>