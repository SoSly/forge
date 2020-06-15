import Vue from 'vue';
import VueRouter from 'vue-router';

import DocumentEdit from '../components/DocumentEdit';
import Home from '../components/Home';
import Profile from '../components/Profile';
import Workbench from '../components/Workbench';

Vue.use(VueRouter);
export default new VueRouter({
    mode: 'history',
    hash: 'false',
    routes: [
        {name: 'document edit',path: '/document/edit/:id',component: DocumentEdit},
        {name: 'home', path: '/', component: Home},
        {name: 'profile', path: '/profile', component: Profile},
        {name: 'workbench',path: '/workbench', component: Workbench,
            children: [{name: 'workbenchChild', path: ':id', component: Workbench}]
        }
    ]
});
