<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, watch } from 'vue';

const title = 'Home';
const $store = useStore();
const $router = useRouter();

const loggedIn = computed(() => $store.getters['user/loggedIn']);

watch(loggedIn, (isLoggedIn) => {
    if (isLoggedIn) {
        $router.push('/workbench');
    }
}, { immediate: true });
</script>
<template>
    <article></article>
</template>