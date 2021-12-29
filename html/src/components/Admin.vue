<script setup lang=ts>
import Audit from './Admin/Audit.vue';
import Header from './Admin/Header.vue';

import { useRoute } from 'vue-router';
const $route = useRoute();
</script>

<style scoped lang=scss>
</style>

<template>
<section id="admin">
    <Header></Header>
    <Audit v-if="$route.name == 'admin-audit'"></Audit>
</section>
</template>