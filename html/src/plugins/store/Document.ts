import axios from 'axios';
import { forge } from "types";

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state(): forge.Document | {} {
        return {}
    },
    actions: {
        async create({dispatch}, {folderId, name}) {
            const response = await axios.post('/api/document', {folderId, name});
            await dispatch('folder/get', folderId, {root: true});
        },
        async get({commit}, id) {
            const response = await axios.get(`/api/document/${id}`);
            await commit('load', response.data);
        },
        async delete({dispatch, rootState}, id) {
            const response = await axios.delete(`/api/document/${id}`);
            await dispatch('folder/get', rootState.folder.id, {root: true});
        },
        async move({commit}, {folderId, document}) {
            const {id} = document;
            await axios.patch(`/api/document/${id}`, {folderId});
            commit('folder/removeDocument', {folderId, document}, {root: true});
        },
        async rename({state}) {
            const {id, name} = state;
            await axios.patch(`/api/document/${id}`, {name});
        },
        async save ({state}) {
            await axios.patch(`/api/document/${state.id}`, state);
        }
    },
    mutations: {
        async load(state: forge.Document | {}, document: forge.Document) {
            Object.keys(document).map(k => state[k] = document[k]);
        }
    }
}