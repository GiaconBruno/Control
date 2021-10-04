import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex'
import routes from './routes';
import axios from 'axios';
import App from './App.vue';
import store from './store/store'
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Toasted from 'vue-toasted';
import money from 'v-money';

import service from './services/auth';
// import common from '@/services/common.js';
import access from '@/store/access.js';

require('@/assets/css/all.min.css');
require('@/assets/css/fontawesome.min.css');

const router = new VueRouter({
  routes: routes,
  mode: 'history',
});
Vue.use(VueRouter);
Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Toasted);
Vue.use(money, {
  precision: 2,
  prefix: 'R$ ',
  decimal: ',',
  thousands: '.',
});

// DEFINE VARIAVEIS GLOBAL
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
Vue.prototype.axios = axios;
Vue.prototype.api = process.env.VUE_APP_BASE_URL;
Vue.prototype.auth = service.auth;
// Vue.prototype.common = common;
Vue.mixin(access);

Vue.config.productionTip = false;
console.log(process.env.VUE_APP_BASE_URL);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');