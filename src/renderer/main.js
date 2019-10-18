require('dotenv').config()

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon)

import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

import Misc from '@/mixins/Misc';
Vue.mixin(Misc)

import Timer from '@/mixins/Timer';
Vue.mixin(Timer);

import Project from '@/mixins/Project';
Vue.mixin(Project);

import User from '@/mixins/User';
Vue.mixin(User)

import Screenshot from '@/mixins/Screenshot';
Vue.mixin(Screenshot)

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, {
    inject: true,
    fieldsBagName: 'veeFields',
    errorBagName: 'veeErrors'
});

import swal from 'sweetalert';

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>',
}).$mount('#app')
