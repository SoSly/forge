import axios from 'axios';

function errorHandler(err) {
    console.error(`API Error`, err);
}

export default {
    actions: {
        getFolder(context, id) {
            let path = '/api/folder';
            if (id) path += `/${id}`;
            axios.get(path)
                .then((result) => context.commit('load', result.data))
                .catch(errorHandler);
        }
    },
    mutations: {
        load(state, folder) {
            if (folder && folder.id) {
                state.folder = folder;
            }
        }
    },
    namespaced: true,
    state: {
        folder: null
    }
};
