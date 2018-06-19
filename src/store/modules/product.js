import api from '@/api'
// import * as types from '../mutation_types'

const { product } = api;
//mutations types
const mutations_types = {
    fetched: "product/fetched",
    created: "product/create",
    updated: "product/updated",
    list: "product/list"
}


const state = {
    list: {},
    create_reulst: {},
    update_result: {}

}

const getters = {

}
const actions = {

    async createProduct({ commit, state }, payload) {
        let res = await product.create(payload);
        // await this.dispatch('provinces');
        commit(mutations_types.created, { res })
        return Promise.resolve(res)

    },
    async updateProduct({ commit, state, getters }, payload) {
        // let res = getters.children('1')
        let res = await product.update(payload);
        commit(mutations_types.updated, { res });
        return Promise.resolve(res)

    },
    async getProductList({ commit, state, getters }, payload) {
        let res = await product.list(payload);
        commit(mutations_types.list, { res })

    },
    async getProduct({ commit, state, getters }, payload) {
        let res = await product.fetch(payload);
        commit(mutations_types.fetched, { res });
        return Promise.resolve(res)
    },
}
const mutations = {

    [mutations_types.created](state, { res }) {
        state.create_reulst = res;
    },
    [mutations_types.updated](state, { res }) {
        state.update_result = res;
    },
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
