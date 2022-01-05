import { createLogger, createStore } from 'vuex';

import {forge} from 'types';

import auditlog from './store/AuditLog';
import contentadmin from './store/ContentAdmin';
import document from './store/Document';
import folder from './store/Folder';
import user from './store/User';
import usersadmin from './store/UsersAdmin';

const store = createStore({
    plugins: [createLogger()],
    modules: {auditlog, contentadmin, document, folder, user, usersadmin},
});

export default store;
