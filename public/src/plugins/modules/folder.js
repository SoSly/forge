import axios from 'axios';

function errorHandler(err) {
    console.error(`API Error`, err);
}

export default {
    actions: {
        createFolder(context, folder) {
            return axios.post('/api/folder', folder)
                .catch(errorHandler);
        },
        delete(context, id) {
            return axios.delete(`/api/folder/${id}`)
                .catch(errorHandler);
        },
        getFolder(context, id) {
            let path = '/api/folder';
            if (id) path += `/${id}`;
            axios.get(path)
                .then((result) => context.commit('load', result.data))
                .catch(errorHandler);
        },
        patchFolder(context, changes) {
            let path = `/api/folder/${changes.id}`;
            axios.patch(path, changes)
                .then((result) => context.commit('patch', changes))
                .catch(errorHandler);
        },
        setParent(context, {id, parentId}) {
            let path = `/api/folder/${id}`;
            return axios.patch(path, {parentId})
                .catch(errorHandler);
        }
    },
    mutations: {
        load(state, folder) {
            if (folder && folder.id) {
                state.folder = folder;
            }
        },
        patch(state, changes) {
            for (let field in changes) {
                state.folder[field] = changes[field];
            }
        }
    },
    namespaced: true,
    state: {
        folder: null
    }
};
