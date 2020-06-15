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
            return axios.delete(`/api/document/${id}`)
                .then((result) => context.commit('load', result.data))
                .catch(errorHandler);
        },
        setFolder(context, {id, folderId}) {
            let path = `/api/document/${id}`;
            return axios.patch(path, {folderId})
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
