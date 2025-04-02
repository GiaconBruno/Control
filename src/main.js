import { createApp, ref } from 'vue'
import store from './store';
import router from './routes';
import axios from 'axios'
import common from './services/common.js';
import { Buffer } from "buffer";
// import auth from './services/auth.js';
import { createBootstrap } from 'bootstrap-vue-next';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'vue3-toastify/dist/index.css';

import '@/assets/Poppins.css';
import '@/assets/fontawesome/css/all.min.css';
import '@/assets/fontawesome/css/fontawesome.min.css';

import App from './App.vue'
const app = createApp(App);

app.use(store);
app.use(router);
app.use(createBootstrap());

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

app.config.globalProperties.axios = axios;
app.config.globalProperties.store = store;
app.config.globalProperties.Buffer = Buffer;

app.config.productionTip = false

app.mixin(common);

app.config.productionTip = false


app.mount('#app');
