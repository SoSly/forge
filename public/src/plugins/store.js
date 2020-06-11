import Vue from 'vue';
import Vuex from 'vuex';

import document from './modules/document';
import folder from './modules/folder';
import user from './modules/user';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {document, folder, user}
});
