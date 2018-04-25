import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from '@/plugin/vueAxios'
import Auth from './plugin/auth'
import { sync } from 'vuex-router-sync'
import * as filters from '@/filters'

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('@/assets/css/', false, /\.css$/));
Vue.router = router;
sync(store, router);//use vuex-router-sync to sync store and router state
Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://localhost:7001/';
Vue.use(Auth, { router: router, store: store })
// Vue.use(require('@websanova/vue-auth'), {
//   auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
//   http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
//   router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
//   tokenDefaultName: '_auth',
//   // loginData: { url: 'account/token', method: 'POST', redirect: '/', fetchUser: true },
//   // fetchData: { url: 'api/me', method: 'GET', enabled: true },
//   refreshData: { url: 'api/token/refresh', method: 'GET', enabled: true, interval: 30 },
// })
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
