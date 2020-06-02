import Vue from 'vue';

// Components
import App from './components/App.vue';

// Services
import router from './router';
import store from './store';

import './directives/click-outside';

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
