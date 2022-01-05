import App from './components/App.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { createSSRApp as createVueApp } from 'vue'

// setup fontawesomes
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBan, faBook, faEye, faFolder, faFileAlt, faFileCode, faHome, faList, faPencilAlt, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
library.add(faBan, faBook, faEye, faFileAlt, faFileCode, faFolder, faHome, faList, faPencilAlt, faSave, faTimes, faTrash);

// directives
import clickOutside from 'click-outside-vue3';

// mixins
import title from './mixins/title';

// plugins
import router from './plugins/router'
import store from './plugins/store';
import shortkey from 'vue3-shortkey';

const app = createVueApp(App)
    .use(clickOutside)
    .use(router)
    .use(shortkey)
    .use(store)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mixin(title)
    .mount('#app');