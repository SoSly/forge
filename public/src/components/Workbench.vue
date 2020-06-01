<template>
    <div id="workbench" v-if="loggedIn"></div>
</template>

<script>
import {mapGetters, mapState} from 'Vuex';

export default {
    name: 'workbench',
    computed: {
        ...mapState({
        }),
        ...mapGetters({
        })
    }
}
</script>

<style lang="scss">
</style>
