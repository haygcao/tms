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
import vueHeadful from 'vue-headful';
import ShoppingCard from './plugin/shoppingCard'
import EmptyDataView from '@/components/EmptyDataView.vue'
import CNY from '@/components/CNY.vue'
// 实例化Vue的filter
Object.keys(filters).forEach(k => {
  // console.log('filter', k)
  Vue.filter(k, filters[k])
});

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('@/assets/css/', true, /\.css$/));
Vue.router = router;
sync(store, router);//use vuex-router-sync to sync store and router state
Vue.use(VueAxios, axios)
axios.defaults.baseURL = process.env.VUE_APP_TMSAPI || 'http://localhost:7001/';
Vue.use(Auth, { router: router, store: store })
Vue.use(ShoppingCard);
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('vue-headful', vueHeadful);
Vue.component('empty-data-view', EmptyDataView);
Vue.component('cny',CNY);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
