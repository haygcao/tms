import api from '@/api'
// import * as types from '../mutation_types'

const franchisee = api.franchisee;
// import { host } from '../../api/constants'
//mutations types
const mutations_types = {
    created: "franchisee.created",
}


const state = {
    createResult: null
}

const getters = {

}
const actions = {

    async createFranchisee({ commit, state }, payload) {
        try {
            let res = await franchisee.create(payload);
            commit(mutations_types.created, { res })

        } catch (err) {
            let res = err.response.data;
            commit(mutations_types.created, { res })
        }
        // await this.dispatch('provinces');

    },
    async provinces({ commit, state, getters }, payload) {
        // let res = getters.children('1')
        let res = await region.getProvinces();
        commit(mutations_types.received_provinces, { res })

    },
}
const mutations = {

    [mutations_types.created](state, { res }) {
        state.createResult = res;
    },
    [mutations_types.received_provinces](state, { res }) {
        // state.provinces = res;
    },

}
export default {
    state,
    getters,
    actions,
    mutations
}
