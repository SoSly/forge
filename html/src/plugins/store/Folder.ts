import axios from 'axios';
import {forge} from 'types';

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state(): forge.Folder | {} {
        return {}
    },
    actions: {
        async get({commit}, id: string | undefined) {
            let url = '/api/folder';
            if (id !== undefined) {
                url += `/${id}`;
            }
            const response = await axios.get(url);
            await commit('load', response.data);
        },
        async create(ctx, folder: forge.Folder): Promise<forge.Folder> {
            const response = await axios.post('/api/folder', folder);
            return response.data;
        },
        async delete({state}, deleted: string) {
            await axios.delete(`/api/folder/${deleted}`);
            state.children = state.children.filter(({id}) => id != deleted);
        },
        async save({state}) {
            const {id, name} = state;
            await axios.patch(`/api/folder/${id}`, {id, name});
        }
    },
    mutations: {
        async load(state: forge.Folder | {}, folder: forge.Folder) {
            Object.keys(folder).map(k => state[k] = folder[k]);
        }
    }
}