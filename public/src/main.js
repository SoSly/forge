import Vue from 'vue';
Vue.config.devtools = true

// Components
import App from './components/App.vue';

// Plugins
import router from './plugins/router';
import store from './plugins/store';
import './plugins/fontawesome';

// import './directives/click-outside';

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
})
