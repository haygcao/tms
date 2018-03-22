import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
let plugins = [];
if (process.env.NODE_ENV !== 'production') {
  plugins = plugins.concat([createLogger()]);

}

const state={

}
const mutations={}
const actions={}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production',
  plugins: plugins
})