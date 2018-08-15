import api from '@/api'
// import * as types from '../mutation_types'
const { clazz_transfer } = api;
//mutations types
const mutations_types = {
    transfer: "transfer_clazz/transfer",
    getStudentClazzList: "transfer_clazz/getStudentClazzList",
    searchClazzListToTransfer: "transfer_clazz/searchClazzListToTransfer",
    transfer_logs: "transfer_clazz/transfer_logs"
}


const state = {
    // list_student_reschedule: {},
    // clazzListToReschedule: {}

    transferLogs: {}
}

const getters = {

}
const actions = {

    async getStudentTransferClazzList({ commit, state }, payload) {
        let res = await clazz_transfer.getStudentClazzList(payload);
        // commit(mutations_types.created, { res })
        return res

    },
    async searchClazzListToTransfer({ commit, state, getters }, payload) {
        let res = await clazz_transfer.searchClazzListToTransfer(payload);
        return res

    },
    async transferClazz({ commit, state, getters }, payload) {
        let res = await clazz_transfer.transfer(payload);
        return res
    },
    async getStudentTransferClazzLog({ commit, state, getters }, payload) {
        let res = await clazz_transfer.getStudentTransferClazzLog(payload);
        commit(mutations_types.transfer_logs, { res })
        return res
    },
}
const mutations = {

    [mutations_types.transfer_logs](state, { res }) {
        state.transferLogs = res;
    },

}
export default {
    state,
    getters,
    actions,
    mutations
}
