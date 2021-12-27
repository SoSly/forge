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
        async move({commit}, {parentId, folder}) {
            const {id} = folder;
            await axios.patch(`/api/folder/${id}`, {parentId});
            commit('removeChild', {parentId, folder});
        },
        async save({state}) {
            const {id, name} = state;
            await axios.patch(`/api/folder/${id}`, {id, name});
        }
    },
    mutations: {
        async load(state: forge.Folder | {}, folder: forge.Folder) {
            Object.keys(folder).map(k => state[k] = folder[k]);
        },
        removeDocument(state: forge.Folder, {folderId, document}) {
            if (state.id != folderId) {
                state.documents = state.documents.filter(({id}) => id != document.id);
            }
        },
        removeChild(state: forge.Folder, {parentId, folder}) {
            if (state.id != parentId) {
                state.children = state.children.filter(({id}) => id != folder.id);
            }
        }
    },
    getters: {
        contents(state) {
            const contents: forge.FolderItem[] = [];
            state.children.forEach(({id, name, createdAt, updatedAt, size}) => contents.push({id, name, createdAt, updatedAt, size, type: 'folder'}));
            state.documents.forEach(({id, name, createdAt, updatedAt, size}) => contents.push({id, name, createdAt, updatedAt, size, type: 'document'}));
            return contents;
        }
    }
}