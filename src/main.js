import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import axios from 'axios';
import App from './App.vue';
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Toasted from 'vue-toasted';
import service from './services/auth';

require('@/assets/css/all.min.css');
require('@/assets/css/fontawesome.min.css');
// require('@/assets/webfonts/')

const router = new VueRouter({
  routes: routes,
  mode: 'history',
});
Vue.use(VueRouter);
Vue.use(BootstrapVue, IconsPlugin);
Vue.use(Toasted);

// DEFINE VARIAVEIS GLOBAL
Vue.prototype.axios = axios;
Vue.prototype.api = process.env.VUE_APP_BASE_URL;
Vue.prototype.auth = service.auth;

Vue.config.productionTip = false;
console.log(process.env.VUE_APP_BASE_URL);
new Vue({
  render: h => h(App),
  router
}).$mount('#app');