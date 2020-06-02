<template>
<div id="app" v-bind:class="darkmode">
    <link rel="stylesheet" type="text/css" href="/reset.css" />
    <PageNav></PageNav>
    <article >
        <router-view></router-view>
    </article>
</div>
</template>

<script>
import PageNav from './PageNav';

export default {
    components: {PageNav},
    name: 'app',
    computed: {
        darkmode() {
            return this.$store.state.user.darkmode ? 'dark' : 'light';
        }
    },
    created() {
        this.$store.dispatch('user/getUser');
    },
    
}
</script>

<style lang="scss">
html { height: 100% }
body { min-height: 100%; }
#app {
    background: white;
    color: black;
    min-height: 100vh;
    article { padding-top: 64px; }

    &.dark { 
        background: #111; 
        color: white;
    }
}
</style>
