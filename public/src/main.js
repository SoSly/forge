import Vue from 'vue';
Vue.config.devtools = true

// Components
import App from './components/App.vue';

// Plugins
import router from './plugins/router';
import store from './plugins/store';
import './plugins/fontawesome';
import VueDragDrop from 'vue-drag-drop';

// import './directives/click-outside';

Vue.use(VueDragDrop);
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
})
