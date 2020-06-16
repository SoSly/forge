import axios from 'axios';

function errorHandler(err) {
    console.error(`API Error`, err);
}

export default {
    actions: {
        createDocument(context, document) {
            return axios.post('/api/document', document)
                .catch(errorHandler);
        },
        delete(context, id) {
            return axios.delete(`/api/document/${id}`)
                .catch(errorHandler);
        },
        get(context, id) {
            return axios.get(`/api/document/${id}`)
                .then((result) => context.commit('load', result.data))
                .catch(errorHandler);
        },
        rename(context, {id, name}) {
            return axios.patch(`/api/document/${id}`, {name})
                .catch(errorHandler);
        },
        setFolder(context, {id, folderId}) {
            return axios.patch(`/api/document/${id}`, {folderId})
                .catch(errorHandler);
        },
        save(context, changes) {
            const {id} = changes;
            delete changes.id;
            debugger;
            return axios.patch(`/api/document/${id}`, changes)
                .catch(errorHandler);
        }
    },
    mutations: {
        load(state, document) {
            if (document && document.id) {
                state.document = document
            }
        }
    },
    namespaced: true,
    state: {
        document: null
    }
};
