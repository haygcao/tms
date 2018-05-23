import api from '@/api'
const { clazz, course } = api;
import {CLEAR_STATE} from '../mutation_types';
const mutations_types = {
    clazz_list: "clazz/list",
    clazz_fetch: "clazz/fetchedById",
    clazz_create: "clazz/create",
    course_fetched: "clazz/course_fetched",
    clear_state: "clazz/clear_state",
}
const state = {
    clazzList: {},
    course: {},
    createResult: {},
    selectedClazz: {}

}
const getters = {

}
const actions = {
    async getClazzById({ commit, state, getters }, payload) {
        let res = await clazz.findById(payload);
        commit(mutations_types.clazz_fetch, { res })
    },
    async getClazzList({ commit, state, getters }, payload) {
        let res = await clazz.list(payload);
        commit(mutations_types.clazz_list, { res })
    },
    async fetchCourse({ commit, state, getters }, payload) {
        let res = await course.fetch(payload);
        commit(mutations_types.course_fetched, { res })
    },
    async createClazz({ commit, state, getters }, payload) {
        let res = await clazz.create(payload);
        commit(mutations_types.clazz_create, { res })
    },
    async clearClazzCreateStates({ commit, state, getters }) {
        commit(mutations_types.clear_state)
    }
}
const mutations = {
    [mutations_types.clazz_list](state, { res }) {
        state.clazzList = res;
    },
    [mutations_types.clazz_fetch](state, { res }) {
        state.selectedClazz = res;
    },
    [mutations_types.course_fetched](state, { res }) {
        state.course = res;
    },
    [mutations_types.clazz_create](state, { res }) {
        state.createResult = res;
    },
    [mutations_types.clear_state](state) {
        state.course = {};
        state.createResult = {}
    },
    [CLEAR_STATE](state) {
        state.course = {};
        state.createResult = {};
        state.clazzList={};
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}