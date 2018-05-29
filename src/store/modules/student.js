import api from '@/api'
const { clazz, course, student, purchase } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {

    create_student: 'student/create_student',
    update_student: 'student/update_student',
    create_student_parent: "student/create_student_parent",
    clear_state: "student/clear_state",
    fetched_student: "student/fetched_student",
}
const state = {
    // clazzList: {},
    current: {},
    studentList:{},
    createStudentResult: {},
    updateStudentResult: {},
    addStudentParentResult: {},
}
const getters = {

}
const actions = {
    async getStudentByMobile({ commit, state, getters }, payload) {
        let res = await student.findByMobile(payload);
        commit(mutations_types.fetched_student, { res })
        return Promise.resolve(res);
    },
    async getStudentById({ commit, state, getters }, payload) {
        let res = await student.findById(payload);
        commit(mutations_types.fetched_student, { res })
        return Promise.resolve(res);
    },
    async checkStudentExist({ commit, state, getters }, payload) {
        let res = await student.findByMobile(payload);
        return Promise.resolve(res);
    },
    async createStudent({ commit, state, getters }, payload) {
        let res = await student.create(payload);
        commit(mutations_types.create_student, { res });
        return Promise.resolve(res);
    },
    async updateStudent({ commit, state, getters }, payload) {
        let res = await student.update(payload);
        commit(mutations_types.update_student, { res });
        return Promise.resolve(res);
    },
    async addStudentParent({ commit, state, getters }, payload) {
        let res = await student.addParent(payload);
        commit(mutations_types.create_student_parent, { res })
    },
    async clearStudentCreateStates({ commit, state, getters }) {
        commit(mutations_types.clear_state)
    }
}
const mutations = {
    [mutations_types.create_student](state, { res }) {
        state.createStudentResult = res;
    },
    [mutations_types.fetched_student](state, { res }) {
        state.current = res;
    },
    [mutations_types.update_student](state, { res }) {
        state.updateStudentResult = res;
    },
    [mutations_types.create_student_parent](state, { res }) {
        state.addStudentParentResult = res;
    },
    [mutations_types.clear_state](state) {
        state.current = {};
        state.createStudentResult = {};
        state.addStudentParentResult = {}

    },
    [CLEAR_STATE](state) {
        state.current = {};
        state.createStudentResult = {};
        state.addStudentParentResult = {};

    },
}
export default {
    state,
    getters,
    actions,
    mutations
}