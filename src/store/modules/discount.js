import api from '@/api'
// import * as types from '../mutation_types'

const { discount } = api;
//mutations types
const mutations_types = {
    created: "discount/create",
    removed: "discount/removed",
    list: "discount/list"
}


const state = {
    list: {},
    create_reulst: {},
    removed_result: {},
    // fetched_product:{}
}

const getters = {

}
const actions = {

    async createDiscount({ commit, state }, payload) {
        let res = await discount.create(payload);
        // await this.dispatch('provinces');
        // commit(mutations_types.created, { res })
        return Promise.resolve(res)

    },
    async removeDiscount({ commit, state, getters }, payload) {
        // let res = getters.children('1')
        let res = await discount.remove(payload);
        commit(mutations_types.removed, { res });
        return Promise.resolve(res)

    },
    async updateDiscount({ commit, state, getters }, payload) {
        let res = await discount.update(payload);
        return Promise.resolve(res)
    },
    async getDiscountList({ commit, state, getters }, payload) {
        let res = await discount.list(payload);
        commit(mutations_types.list, { res })
        return Promise.resolve(Object.assign({}, res))

    },

}
const mutations = {

    [mutations_types.created](state, { res }) {
        state.create_reulst = res;
    },

    [mutations_types.list](state, { res }) {
        state.list = res;
    },
    [mutations_types.removed](state, { res }) {
        state.removed_result = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
