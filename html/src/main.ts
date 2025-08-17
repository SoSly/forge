import App from './components/App.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { createSSRApp as createVueApp } from 'vue'
import { initializeCSRF } from './plugins/axios'

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
import shortkey from 'vue3-shortkey';

async function startApp() {
    await initializeCSRF();
    
    const app = createVueApp(App)
        .use(clickOutside)
        .use(router)
        .use(shortkey)
        .use(store)
        .component('font-awesome-icon', FontAwesomeIcon)
        .mixin(title)
        .mount('#app');
}

startApp();