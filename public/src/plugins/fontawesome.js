import Vue from 'vue';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faFileAlt, faFolder, faHome, faPencilAlt, faPlusCircle, faTrash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faFileAlt, faFolder, faHome, faPencilAlt, faPlusCircle, faTrash);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false
