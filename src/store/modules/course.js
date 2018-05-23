import api from '@/api'
const { course } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {
    course_list: "course/list",
    create: "course/create",
}
const state = {
    courseList: {},
    createResult: {},
}
const getters = {

}
const actions = {
    async getCourseList({ commit, state, getters }, payload) {
        let res = await clazz.list(payload);
        commit(mutations_types.course_list, { res })
    },
    async createCourse({ commit, state, getters }, payload) {
        let res = await course.create(payload);
        commit(mutations_types.create, { res })
    }
}
const mutations = {
    [mutations_types.course_list](state, { res }) {
        state.courseList = res;
    },
    [mutations_types.create](state, { res }) {
        state.createResult = res;
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