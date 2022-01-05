import axios from 'axios';
import { forge } from 'types';

type ContentAdminStore = {
    page: number,
    pages: number,
    contents: forge.Document[]
}

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state(): ContentAdminStore {
        return {
            page: 1,
            pages: 1,
            contents: []
        }
    },
    actions: {
        async get({commit}, {page, user}: {page: number | undefined, user: forge.User}) {
            const response = await axios.get(`/api/admin/content/${user.id}`);
            await commit('load', response.data);
        }
    },
    mutations: {
        async load(state: ContentAdminStore, response: ContentAdminStore) {
            state.page = response.page;
            state.pages = response.pages;
            state.contents = response.contents;
        }
    }
}