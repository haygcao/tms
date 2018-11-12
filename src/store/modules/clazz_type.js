import api from '@/api'
// import * as types from '../mutation_types'

const { clazz_type } = api;
//mutations types
const mutations_types = {
    created: "clazz_type/create",
    fetch: "clazz_type/fetch",
    list: "clazz_type/list"
}


const state = {
    list: {},
}

const getters = {

}
const actions = {

    async createClazzType({ commit, state }, payload) {
        let res = await clazz_type.create(payload);
        // await this.dispatch('provinces');
        // commit(mutations_types.created, { res })
        return res

    },
    async updateClazzType({ commit, state, getters }, payload) {
        let res = await clazz_type.update(payload);
        return res;

    },
    async getAllClazzTypeList({ commit, state, getters }, payload) {
        let res = await clazz_type.list(payload);
        commit(mutations_types.list, { res })
        return res;
    },
    async getClazzTypeById({ commit, state, getters }, payload) {
        let res = await clazz_type.fetch(payload);
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
