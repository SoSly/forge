import axios from 'axios';

function errorHandler(err) {
    console.error(`API Error`, err);
}

export default {
    actions: {
        getUser(context) {
            axios.get('/api/profile')
                .then((result) => context.commit('load', result.data))
                .catch(errorHandler);
        },
        toggleDarkMode(context, mode) {
            axios.patch('/api/settings', {darkmode: mode})
                .then((result) => {
                    context.commit('toggleDarkMode', mode);
                })
                .catch(errorHandler);
        }
    },
    getters: {
        avatar(state) {
            switch(state.user.provider) {
                case 'discord':
                    const {providerId, avatar} = state.user;
                    return `https://cdn.discordapp.com/avatars/${providerId}/${avatar}.png`;
            }
        },
        darkmode(state) {
            return (state.user.settings.darkmode === true);
        }
    },
    mutations: {
        load(state, user) {
            if (user && user.id) {
                state.loggedIn = true;
                state.user = user;
            }
        },
        toggleDarkMode(state, mode) {
            state.user.settings.darkmode = mode;
        }
    },
    namespaced: true,
    state: {
        loggedIn: false,
        user: null
    }
}
