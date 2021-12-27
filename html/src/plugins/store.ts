import { createLogger, createStore } from 'vuex';

import {forge} from 'types';

import document from './store/Document';
import folder from './store/Folder';
import user from './store/User';

const store = createStore({
    plugins: [createLogger()],
    modules: {document, folder, user},
    
    state(): forge.Store {
        return {
            profileMenu: false
        }
    },
    mutations: {
        setProfileMenu (state: forge.Store, v: boolean) {
            state.profileMenu = v;
        }
    },
});

export default store;
