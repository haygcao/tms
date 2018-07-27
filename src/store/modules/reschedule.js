import api from '@/api'
// import * as types from '../mutation_types'

const { reschedule,student } = api;
//mutations types
const mutations_types = {
    created: "reschedule/create",
    list_student_reschedule: "reschedule/list_student_reschedule",
    findClazzListToReschedule: "reschedule/findClazzListToReschedule"
}


const state = {
    list_student_reschedule: {},
    clazzListToReschedule: {}
}

const getters = {

}
const actions = {

    async createStudentReschedule({ commit, state }, payload) {
        let res = await reschedule.create(payload);
        // commit(mutations_types.created, { res })
        return Promise.resolve(res)

    },
    async removeStudentReschedule({ commit, state, getters }, payload) {
        let res = await reschedule.remove(payload);
        return Promise.resolve(res)

    },
    async findClazzListToReschedule({ commit, state, getters }, payload) {
        let res = await reschedule.findClazzListToReschedule(payload);
        commit(mutations_types.findClazzListToReschedule, { res })
        return Promise.resolve(res)
    },
    async loadStudentReschedules({ commit, state, getters }, payload) {
        let res = await reschedule.loadStudentReschedules(payload);
        commit(mutations_types.list_student_reschedule, { res })
        return Promise.resolve(Object.assign({}, res))

    },
    async getStudentClazzListAndRescheduleInfo({ commit, state, getters }, payload) {
        let res = await student.getClazzList(payload);
        // commit(mutations_types.list_students, { res })
        return Promise.resolve(res);
    },
}
const mutations = {

    // [mutations_types.created](state, { res }) {
    //     state.create_reulst = res;
    // },

    [mutations_types.findClazzListToReschedule](state, { res }) {
        state.clazzListToReschedule = res;
    },
    [mutations_types.list_student_reschedule](state, { res }) {
        state.list_student_reschedule = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
