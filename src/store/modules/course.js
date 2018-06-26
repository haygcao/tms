import api from '@/api'
const { course } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {
    course_list: "course/list",
    create: "course/create",
    detail: "course/detail",
}
const state = {
    courseList: {},
    createResult: {},
    detail:{},
}
const getters = {

}
const actions = {
    async getCourseList({ commit, state, getters }, payload) {
        let res = await course.list(payload);
        commit(mutations_types.course_list, { res })
    },
    async createCourse({ commit, state, getters }, payload) {
        let res = await course.create(payload);
        commit(mutations_types.create, { res })
    },
    async getCourseDetail({ commit, state, getters }, payload) {
        let res = await course.detail(payload);
        commit(mutations_types.detail, { res })
    },
    async setCourseware({ commit, state, getters }, payload) {
        let res = await course.setCourseware(payload);
        return Promise.resolve(res)
        // commit(mutations_types.detail, { res })
    },
    async setHomework({ commit, state, getters }, payload) {
        let res = await course.setHomework(payload);
        return Promise.resolve(res)
        // commit(mutations_types.detail, { res })
    }
}
const mutations = {
    [mutations_types.course_list](state, { res }) {
        state.courseList = res;
    },
    [mutations_types.create](state, { res }) {
        state.createResult = res;
    },
    [mutations_types.detail](state, { res }) {
        state.detail = res;
    },
    [CLEAR_STATE](state) {
        state = {
            courseList: {},
            createResult: {},
        }

    },
}
export default {
    state,
    getters,
    actions,
    mutations
}