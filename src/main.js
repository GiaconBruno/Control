import { createApp } from 'vue'
import store from './store';
import router from './routes';
import common from './services/common';
import { Buffer } from "buffer";
// import auth from './services/auth.js';
import { createBootstrap } from 'bootstrap-vue-next';
import VueApexCharts from 'vue3-apexcharts';
import api from './services/interceptors';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'vue3-toastify/dist/index.css';

import '@/assets/Poppins.css';
import '@/assets/fontawesome/css/all.min.css';
import '@/assets/fontawesome/css/fontawesome.min.css';

import App from './App.vue'
const app = createApp(App);


app.component('apexchart', VueApexCharts);

app.config.globalProperties.axios = api;
app.config.globalProperties.store = store;
app.config.globalProperties.Buffer = Buffer;

app.mixin(common);

app.use(store);
app.use(router);
app.use(createBootstrap());

app.mount('#app');
