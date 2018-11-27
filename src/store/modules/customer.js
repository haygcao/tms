import api from '@/api'
// import * as types from '../mutation_types'

const { customer } = api;
//mutations types
const mutations_types = {
    list: "customer/list"
}


const state = {
    list: {},
}

const getters = {

}
const actions = {

    async createCustomer({ commit, state }, payload) {
        let res = await customer.create(payload);
        return res

    },
    async getCustomerById({ commit, state }, payload) {
        let res = await customer.fetch(payload);
        return res

    },
    // async updateMarketChannel({ commit, state, getters }, payload) {
    //     let res = await market_channel.update(payload);
    //     return res;

    // },
    async searchCustomerList({ commit, state, getters }, payload) {
        let res = await customer.list(payload);
        commit(mutations_types.list, { res })
        return res;
    },
    async getStudentParentByMobile({ commit, state, getters }, payload) {
        let res = await customer.findByMobile(payload);
        return res;
    },
    async getCommunicationsByCustomerId({ commit, state, getters }, payload) {
        let res = await customer.getCommunicationsByCustomerId(payload);
        return res;
    },
    async searchCommunicationsList({ commit, state, getters }, payload) {
        let res = await customer.searchCommunicationsList(payload);
        return res;
    },
    async createCommunication({ commit, state, getters }, payload) {
        let res = await customer.createCommunication(payload);
        return res;
    },
    async batchDistibuteCustomerToEmployee({ commit, state, getters }, payload) {
        let res = await customer.batchDistibuteToEmployee(payload);
        return res;
    },
}
const mutations = {


    [mutations_types.list](state, { res }) {
        state.list = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
