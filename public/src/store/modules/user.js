import axios from 'axios';

export default {
    actions: {
        getUser({commit}) {
            axios.get('/api/profile')
                .then((result) => commit('save', result.data))
                .catch((err) => {throw new Error(`API ${err}`);});
        }
    },
    getters: {
        avatar(state) {
            switch(state.user.provider) {
                case 'discord':
                    const id = state.user.provider_id;
                    const avatar = state.user.avatar;
                    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
            }
        }
    },
    mutations: {
        save(state, user) {
            if (user && user.id) {
                state.loggedIn = true;
                state.user = user;
            }
        }
    },
    namespaced: true,
    state: {
        loggedIn: false,
        user: null
    }
}
