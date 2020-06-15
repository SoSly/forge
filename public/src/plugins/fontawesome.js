import Vue from 'vue';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faEye, faFileAlt, faFolder, faHome, faPencilAlt, faPlusCircle, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faEye, faFileAlt, faFolder, faHome, faPencilAlt, faPlusCircle, faSave, faTrash);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false
