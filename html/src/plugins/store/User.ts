import axios from 'axios';
import {forge} from 'types';
import { setupAxios } from '../axios';

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state(): forge.User {
        return {
            id: null,
            username: '',
            type: '',
            avatar: '',
            locale: '',
            provider: '',
            providerId: '',
            settings: {
                darkmode: true,
            },
            usage: {
                current: 0,
                max: 0
            }
        }
    },
    actions: {
        async get({commit}) {
            const response = await axios.get('/api/profile');
            commit('load', response.data);
            
            // Set up CSRF token for all subsequent requests
            if (response.data.csrfToken) {
                setupAxios(response.data.csrfToken);
            }
        }
    },
    getters: {
        avatar(state: forge.User) {
            switch (state.provider) {
                case 'discord': 
                    return `https://cdn.discordapp.com/avatars/${state.providerId}/${state.avatar}.png`;
            }
        },
        darkmode(state: forge.User) {
            return state.settings.darkmode;
        },
        loggedIn(state: forge.User) {
            return state.id !== null;
        }
    },
    mutations: {
        async load(state: forge.User, user: forge.User) {
            Object.keys(user).map(k => state[k] = user[k]);
        }
    }
}