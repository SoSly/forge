import axios from 'axios';

export default {
    actions: {
        getUser({commit}) {
            axios.get('/api/profile')
                .then((result) => commit('load', result.data))
                .catch((err) => {throw new Error(`API ${err}`);});
        }
    },
    getters: {
        avatar(state) {
            switch(state.user.provider) {
                case 'discord':
                    const {providerId, avatar} = state.user;
                    return `https://cdn.discordapp.com/avatars/${providerId}/${avatar}.png`;
            }
        }
    },
    mutations: {
        load(state, user) {
            if (user && user.id) {
                state.loggedIn = true;
                state.user = user;
                // state.darkmode = user.darkmode === false ? false : true;
            }
        },
        toggleDarkMode(state, mode) {
            state.darkmode = mode;
        }
    },
    namespaced: true,
    state: {
        darkmode: false,
        loggedIn: false,
        user: null
    }
}
