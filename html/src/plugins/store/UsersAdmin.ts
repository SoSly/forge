import axios from 'axios';
import { forge } from "types";

type UsersAdminStore = {
    page: number
    pages: number
    users: forge.User[]
}

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state(): UsersAdminStore {
        return {
            page: 1,
            pages: 1,
            users: []
        }
    },
    actions: {
        async ban({dispatch, state}, user: string) {
            await axios.patch(`/api/admin/users/${user}`, {type: 'banned'});
            await dispatch('get', state.page);
        },
        async delete({dispatch, state}, user: string) {
            await axios.delete(`/api/admin/users/${user}`);
            await dispatch('get', state.page);
        },
        async get({commit}, page: number | undefined) {
            let query = `/api/admin/users`;
            if (page !== 1) {
                query += `?page=${page}`;
            }
            const response = await axios.get(query);
            await commit('load', response.data);
        },
        async grant({commit}, user: forge.User) {
            const {id, rights} = user;
            await axios.patch(`/api/admin/users/${id}`, {id, rights});
        }
    },
    mutations: {
        async load(state: UsersAdminStore, response: UsersAdminStore) {
            state.page = response.page;
            state.pages = response.pages;
            state.users = response.users;
        }
    }
}