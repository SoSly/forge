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
            if (this.$store.state.user.user) {
                return this.$store.state.user.user.settings.darkmode ? 'dark' : 'light';
            }
            return 'light';
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
    article {
        background: rgba(51,153,204,0.3);
        min-height: 100vh;
        padding-top: 64px;

        .page {
            background: white;
            box-shadow: 1px 5px 15px #000;
        }
    }

    &.dark { 
        background: #333; 
        color: #DDD;

        article .page { background: #444; }
    }
}
</style>
