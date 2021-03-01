import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import axios from 'axios'
import App from './App.vue'

import allcss from '@/assets/css/all.min.css'
import bootstrapcss from '@/assets/css/bootstrap.min.css'
import fontawesome from '@/assets/css/fontawesome.min.css'

import alljs from '@/assets/js/all.min.js'
import bootstrapjs from '@/assets/js/bootstrap.min.js'

// import webfonts from '@/assets/webfonts/*.woff'

const router = new VueRouter({
  routes
})
Vue.use(VueRouter)
Vue.use(allcss, fontawesome, bootstrapcss)
Vue.use(alljs, bootstrapjs)
Vue.prototype.axios = axios

Vue.config.productionTip = false
console.log(process.env.VUE_APP_BASE_URL)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')