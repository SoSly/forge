import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './components/Home';
import Profile from './components/Profile';

Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        {path: '/', component: Home},
        {path: '/profile', component: Profile}
    ]
})
