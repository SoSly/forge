<template>
<nav id="pagenav">
    <ul class="right">
        <template v-if="loggedIn">
            <li class="profile" v-on:click="showProfileMenu()" v-click-outside="hideProfileMenu">
                <img v-bind:src="avatar" v-on:click="showProfileMenu()" />
                <div v-if="profileMenu" class="submenu">
                    <p>Signed in as <strong>{{user.username}}</strong>.</p>
                    <ul>
                        <li><router-link to="/profile">Your profile</router-link></li>
                        <li><a href="/auth/logout">Sign out</a></li>
                    </ul>
                </div>
            </li>
        </template>
        <template v-else>
            <li class="login"><a href="/auth/login">Sign in</a></li>
        </template>
    </ul>
    <ul class="left">
        <li class="logo"><router-link to="/"><img src="../assets/logo.png" /></router-link></li>
        <template v-if="loggedIn">
            <li class="workbench"><router-link to="/workbench">Your workbench</router-link></li>
        </template>
    </ul>
</nav>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

export default {
    name: 'pagenav',
    data() {
        return {
            profileMenu: false
        }
    },
    methods: {
        hideProfileMenu() {
            this.profileMenu = false;
        },
        showProfileMenu() {
            this.profileMenu = true;
        }
    },
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

<style lang=scss>
#pagenav {
    background: #333;
    padding: 1em 1em 0;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;

    ul {
        display: flex;

        li {
            align-items: center;
            display: flex;
            height: 48px;
        }

        &.left {
            li {
                margin-right: 1em; 

                a, a:visited {
                    align-items: center;
                    border-bottom: 4px solid transparent;
                    color: white;
                    display: flex;
                    font-size: 14pt;
                    font-weight: bold;
                    height: 48px;
                    padding: 0 0.5em;
                    text-decoration: none;

                    &:hover {
                        border-bottom: 4px solid #08C;
                    }
                }

                &.logo {
                    background: white;
                    border-radius: 50%;
                    height: 35px;
                    width: 35px;

                    a {
                        border-bottom: none;
                        margin: 0 auto;
                        padding: 0;
                        &:hover { border-bottom: none; }
                    }

                    img {
                        height: 20px;
                        width: 20px;
                        pointer-events: none;
                    }

                    &:hover {
                        background: #CCC;
                    }
                }
            }
        }

        &.right {
            float: right;

            li {
                margin-left: 1em;

                a, a:visited {
                    align-items: center;
                    border-bottom: 4px solid transparent;
                    color: white;
                    display: flex;
                    font-size: 14pt;
                    font-weight: bold;
                    height: 48px;
                    padding: 0 0.5em;
                    text-decoration: none;

                    &:hover {
                        border-bottom: 4px solid #08C;
                    }
                }

                &.profile {
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    height: 35px;
                    width: 35px;

                    img {
                        height: 25px;
                        margin: 0 auto;
                        pointer-events: none;
                        width: 25px;
                    }

                    .submenu {
                        background: white;
                        border-radius: 5px;
                        border: 1px solid #333;
                        display: block;
                        right: 1em;
                        padding: 0.5em 0;
                        position: fixed;
                        top: 50px;
                        width: 180px;

                        p {
                            padding: 0 0.5em;
                            strong { font-weight: bold; }
                        }

                        ul { 
                            border-top: 1px solid black;
                            display: block; 
                            padding-top: 0.5em;
                            margin-top: 0.5em;
                        }
                        li {
                            display: block;
                            height: auto;
                            margin-left: 0;

                            a {
                                border-bottom: none;
                                display: block;
                                color: black;
                                height: auto;
                                line-height: 1.2em;
                                padding: 0.25em 0.5em;

                                &:hover { 
                                    background-color: #08C; 
                                    color: white;
                                }
                            }
                        }

                        a {
                            display: block;
                            font-size: 10pt;
                            text-decoration: none;
                        }
                    }
                }
            }
        }
    }
}
</style>
