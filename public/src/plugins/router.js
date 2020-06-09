import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home';
import Profile from '../components/Profile';
import Workbench from '../components/Workbench';

Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        {path: '/', component: Home},
        {path: '/profile', component: Profile},
        {path: '/workbench', component: Workbench},
        {path: '/workbench/:id', component: Workbench}
    ]
})
