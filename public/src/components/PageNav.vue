<template>
<nav id="pagenav">
    <ul class="right">
        <template v-if="loggedIn">
            <li class="profile-menu" v-on:click="showProfileMenu()" v-click-outside="hideProfileMenu">
                <img v-bind:src="avatar" v-on:click="showProfileMenu()" />                
                <div v-if="profileMenu" class="submenu">
                    <p>Signed in as <strong>{{user.username}}</strong>.</p>
                    <ul>
                        <li class="profile"><router-link to="/profile">Your profile</router-link></li>
                        <li class="darkmode">
                            <span>Dark Mode</span>
                            <label class="switch">
                                <input type="checkbox" v-model="darkmode" />
                                <span class="slider round"></span>
                            </label>
                        </li>
                        <li class="logout"><a href="/auth/logout">Sign out</a></li>
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
            <!--
            <li class="campaigns"><router-link to="/campaigns">Your campaigns</router-link></li>
            <li class="characters"><router-link to="/characters">Your characters</router-link></li>
            //-->
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
        darkmode: {
            get() {
                return this.$store.state.user.user.settings.darkmode;
            },
            set(val) {
                this.$store.dispatch('user/toggleDarkMode', val);
            }
        },
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
                    color: #999;
                    display: flex;
                    font-size: 14pt;
                    font-weight: bold;
                    height: 48px;
                    padding: 0 0.5em;
                    text-decoration: none;

                    &:hover { border-bottom: 4px solid #08C; }
                    &.router-link-active {
                        border-bottom: 4px solid #08C;
                        color: white;
                    }
                }

                &.logo {
                    background: #CCC;
                    border: 1px solid transparent;
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
                        background: #FFF;
                        border: 1px solid #08C;
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

                &.profile-menu {
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
                        border: 1px solid #666;
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

                            & > span {
                                display: inline-block;
                                color: black;
                                line-height: 1.2em;
                                padding: 0.25em 0.5em;
                            }

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

                        a, span {
                            display: block;
                            font-size: 10pt;
                            font-weight: bold;
                            text-decoration: none;
                        }

                        label.switch {
                            position: relative;
                            display: inline-block;
                            width: 2em;
                            height: 1em;

                            input {
                                opacity: 0;
                                width: 0;
                                height: 0;

                                &:checked + .slider { 
                                    background-color: #08C; 
                                    &:before {
                                        -webkit-transform: translateX(1em);
                                        -ms-transform: translateX(1em);
                                        transform: translateX(1em);
                                    }
                                }
                                &:focus + .slider { box-shadow: 0 0 1px #08C; }
                            }

                            .slider {
                                position: absolute;
                                cursor: pointer;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background-color: #ccc;
                                -webkit-transition: 0.4s;
                                transition: 0.4s;

                                &.round { 
                                    border-radius: 1em; 
                                    &:before { border-radius: 50%; }
                                }

                                &:before {
                                    position: absolute;
                                    content: '';
                                    height: 1em;
                                    width: 1em;
                                    left: 2px;
                                    bottom: 2px;
                                    background-color: white;
                                    -webkit-transition: 0.4s;
                                    transition: 0.4s;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.dark #pagenav {
    background: #111;

    ul.right li.profile-menu .submenu {
        background: #333;
        ul {
            border-top-color: #111;
            a { color: #AAA; }
        }

        li > span { color: #AAA; }
    }
}
</style>
