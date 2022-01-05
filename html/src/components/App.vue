<script setup lang=ts>
import Header from './Header.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const $route = useRoute();
const $store = useStore();

$store.dispatch('user/get');
</script>

<!-- This is unscoped //-->
<style lang="scss">
html { height: 100%; }
a, a:visited { color: #39C; text-decoration: none; }
body#app { font-size: 11pt; min-height: 100%; }
body#app > article {
  background: white;
  color: black;
  min-height: 100vh;

  & > main {
    position: fixed;
    top: 64px;
    background: rgba(51, 153, 204, 0.3);
    min-height: 100vh;
    width: 100%;
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