<template>
    <section id="profile" v-if="loggedIn">
        <section class="left">
            <img v-bind:src="avatar" />
            <h1>{{user.displayName || user.username}}</h1>
        </section>
    </section>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

export default {
    name: 'profile',
    computed: {
        ...mapState({
            loggedIn: (state) => state.user.loggedIn,
            user: (state) => state.user.user
        }),
        ...mapGetters({
            avatar: 'user/avatar'
        })
    }
}
</script>

<style lang="scss">
#profile {
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
            margin-bottom: 1em;
        }

        h1 {
            font-size: 18pt;
            font-weight: bold;
        }
    }
}

.dark #profile {
    background: #333; 
    color: #DDD;
    .left { border-right: 1px solid #666; }
}
</style>
