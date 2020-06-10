import axios from 'axios';

function errorHandler(err) {
    console.error(`API Error`, err);
}

export default {
    actions: {
        createFolder(context, folder) {
            axios.post('/api/folder', folder)
                .then((result) => context.dispatch('getFolder', folder.parentId))
                .catch(errorHandler);
        },
        deleteFolder(context, id) {
            axios.delete(`/api/folder/${id}`)
                .then((Result) => context.commit('delete', id))
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
        }
    },
    mutations: {
        delete(state, id) {
            state.folder = state.folder.children.filter((child) => child.id != id);
        },
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
