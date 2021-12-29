import { createLogger, createStore } from 'vuex';

import {forge} from 'types';

import auditlog from './store/AuditLog';
import document from './store/Document';
import folder from './store/Folder';
import user from './store/User';

const store = createStore({
    plugins: [createLogger()],
    modules: {auditlog, document, folder, user},
});

export default store;
