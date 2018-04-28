import api from '@/api'
// import * as types from '../mutation_types'

const franchisee = api.franchisee;
// import { host } from '../../api/constants'
//mutations types
const mutations_types = {
    created: "franchisee/created",
    list: "franchisee/list",
    schools:"franchisee/schools"
}


const state = {
    createResult: null,
    franchiseeList: {},
    schools:{}
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
    async getFranchiseeList({ commit, state, getters }, payload) {
        payload = Object.assign({ limit: 20, offset: 0 }, payload)
        try {
            let res = await franchisee.list(payload);
            commit(mutations_types.list, { res, payload })
        } catch (err) {
            commit(mutations_types.list, { payload })
        }

    },
    async getSchoolList({ commit, state, getters }, payload) {
        payload = Object.assign({ limit: 20, offset: 0 }, payload)
        try {
            let res = await franchisee.getSchools(payload);
            commit(mutations_types.schools, { res, payload })
        } catch (err) {
            commit(mutations_types.schools, { payload })
        }

    },
}
const mutations = {

    [mutations_types.created](state, { res }) {
        state.createResult = res;
    },
    [mutations_types.list](state, { res, payload }) {
        state.franchiseeList = res || {};
    },
    [mutations_types.schools](state, { res, payload }) {
        state.schools = res || {};
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
