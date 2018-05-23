import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import * as mutation_types from './mutation_types';
Vue.use(Vuex)
let plugins = [createPersistedState({ paths: ["login", "region", "current_user", "school"] })];
if (process.env.NODE_ENV !== 'production') {
  plugins = plugins.concat([createLogger()]);

}

const state = {

}
const getters = {
  terms() {
    let t = Object.keys(Terms).map(p => {
      return { key: p, name: Terms[p] };
    });
    return t;
  },
  subjects() {
    let t = Object.keys(SubjectName).map(p => {
      return { key: p, name: SubjectName[p] };
    });
    return t;
  },
  class_types() {
    let t = Object.keys(ClassType).map(p => {
      return { key: p, name: ClassType[p] };
    });
    return t;
  },
  grades() {
    let t = Object.keys(Grade).map(p => {
      return { key: p, name: Grade[p] };
    });
    return t;
  },
  lesson_times() {
    return [{ key: 60, name: '1h' }, { key: 90, name: '1.5h' }]
  },
  genders() {
    return [
      {
        value: 1,
        label: "男"
      },
      {
        value: 0,
        label: "女"
      }
    ]
  }
}
const mutations = {

}
const actions = {
  async clearState({ commit, state, getters }, payload) {

    commit(mutation_types.CLEAR_STATE);
  },
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  getters,
  strict: process.env.NODE_ENV !== 'production',
  plugins: plugins
})