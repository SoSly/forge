<template>
<div id="app">
    <link rel="stylesheet" type="text/css" href="/reset.css" />
    <PageNav></PageNav>
    <article>
        <router-view></router-view>
    </article>
</div>
</template>

<script>
import PageNav from './PageNav';

export default {
    components: {PageNav},
    name: 'app',
    created() {
        this.$store.dispatch('user/getUser');
    }
}
</script>

<style lang="scss">
html { height: 100% }
body {
    background: white;
    min-height: 100%;
    article { padding-top: 64px; }
}
</style>
