import { createRouter, createWebHistory } from 'vue-router';
import $store from './store';

// Components
import Admin from '../components/Admin.vue';
import DocumentEditor from '../components/DocumentEditor.vue';
import Home from '../components/Home.vue';
import Profile from '../components/Profile.vue';
import Workbench from '../components/Workbench.vue';

// Guard Functions
async function requireAuthUser(): Promise<boolean> {
    return $store.getters['user/isAdmin'];
}

async function requireUser(): Promise<boolean> {
    return $store.getters['user/loggedIn'];
}

async function loadContents(to) {
    switch(to.name) {
        case 'admin-audit':
            console.log('loading audit logs page', to.query.page ?? 1);
            await $store.dispatch('auditlog/get', to.query.page ?? 1);
            break;
        case 'document-editor': 
            console.log('loading document ', to.params.id);
            await $store.dispatch('document/get', to.params.id);
            break;
        case 'workbench':
            console.log('loading root folder');
            await $store.dispatch('folder/get');
            break;
        case 'workbench-folder':
            console.log('loading folder ', to.params.id);
            await $store.dispatch('folder/get', to.params.id);
            break;
    }
}

// Routes
const routes = [
    {path: '/', name: 'home', component: Home},
    {path: '/document/edit/:id', name: 'document-editor', component: DocumentEditor, beforeEnter: [requireUser]},
    {path: '/profile', name: 'profile', component: Profile, beforeEnter: [requireUser]},
    {
        path: '/workbench', name: 'workbench', component: Workbench, beforeEnter: [requireUser],
        children: [
            {path: '/workbench/:id', name: 'workbench-folder', component: Workbench, beforeEnter: [requireUser]},
        ]
    },
    {
        path: '/admin', name: 'admin-audit', component: Admin, beforeEnter: [requireUser, requireAuthUser],
        children: [
            {path: '/admin/users', name: 'admin-users', component: Admin, beforeEnter: [requireUser, requireAuthUser]}
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach(loadContents);

export default router;