import App from './components/App.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { createSSRApp as createVueApp } from 'vue'

// setup fontawesomes
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faFolder, faFileAlt, faHome, faPencilAlt, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faFileAlt, faFolder, faHome, faPencilAlt, faSave, faTrash);

// directives
import clickOutside from 'click-outside-vue3';

// mixins
import title from './mixins/title';

// plugins
import router from './plugins/router'
import store from './plugins/store';

const app = createVueApp(App)
    .use(clickOutside)
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mixin(title)
    .mount('#app');