import axios from 'axios';
import { forge } from 'types';

type AuditLogStore = {
    page: number
    pages: number
    entries: forge.AuditLog[]
}

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state(): AuditLogStore {
        return {
            page: 1,
            pages: 1,
            entries: []
        }
    },
    actions: {
        async get({commit}, page: number | undefined) {
            let query = `/api/admin/audit`;
            if (page !== 1) {
                query += `?page=${page}`
            }
            const response = await axios.get(query);
            await commit('load', response.data);
        }
    },
    mutations: {
        async load(state: AuditLogStore, response: AuditLogStore) {
            state.page = response.page;
            state.pages = response.pages;
            state.entries = response.entries;
        }
    }
}