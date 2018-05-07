import api from '@/api'
const { clazz, course } = api;
const mutations_types = {
    clazz_list: "clazz/list",
    clazz_create: "clazz/create",
    course_fetched: "clazz/course_fetched",
}
const state = {
    clazzList: {},
    course: {},
    createResult: {}
}
const getters = {

}
const actions = {
    async getClazzList({ commit, state, getters }, payload) {
        let res = await clazz.list(payload);
        commit(mutations_types.clazz_list, { res })
    },
    async fetchCourse({ commit, state, getters }, payload) {
        let res = await course.fetch(payload);
        commit(mutations_types.course_fetched, { res })
    },
    async create({ commit, state, getters }, payload) {
        let res = await clazz.create(payload);
        commit(mutations_types.clazz_create, { res })
    }
}
const mutations = {
    [mutations_types.clazz_list](state, { res }) {
        state.clazzList = res;
    },
    [mutations_types.course_fetched](state, { res }) {
        state.course = res;
    },
    [mutations_types.clazz_create](state, { res }) {
        state.course = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}