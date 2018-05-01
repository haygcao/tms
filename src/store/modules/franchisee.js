import api from '@/api'
// import * as types from '../mutation_types'

const franchisee = api.franchisee;
// import { host } from '../../api/constants'
//mutations types
const mutations_types = {
    created: "franchisee/created",
    remove: "franchisee/remove",
    list: "franchisee/list",
    schools: "franchisee/schools",
    detail: "franchisee/detail",
    create_school: "franchisee/school_created",
    remove_school: "franchisee/remove_school",
}


const state = {
    createResult: null,
    franchiseeList: {},
    schools: {},
    current_franchisee: {},
    createSchoolResult: null
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
    async removeFranchisee({ commit, state, getters,dispatch }, payload) {
        let res = await franchisee.remove(payload);
        await dispatch('getFranchiseeList', payload)

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
    async getFranchisee({ commit, state, getters }, payload) {
        let res = await franchisee.show(payload);
        console.log("getFranchisee", payload)
        commit(mutations_types.detail, { res })

    },
    async getSchoolList({ commit, state, getters }, payload) {
        // payload = Object.assign({ limit: 20, offset: 0 }, payload)
        try {
            let res = await franchisee.getSchools(payload);
            commit(mutations_types.schools, { res, payload })
        } catch (err) {
            commit(mutations_types.schools, { payload })
        }

    },
    async addSchool({ commit, state, getters }, payload) {
        let res = await franchisee.addSchool(payload);
        commit(mutations_types.create_school, { res })
    },
    async removeSchool({ commit, state, getters, dispatch }, payload) {
        let res = await franchisee.removeSchool(payload);
        await dispatch('getSchoolList', payload)
    },
}
const mutations = {

    [mutations_types.created](state, { res }) {
        state.createResult = res;
    },
    // [mutations_types.remove](state, { res }) {
    //     state.removeResult = res;
    // },
    [mutations_types.list](state, { res, payload }) {
        state.franchiseeList = res || {};
    },
    [mutations_types.detail](state, { res }) {
        state.current_franchisee = res || {};
    },
    [mutations_types.schools](state, { res, payload }) {
        state.schools = res || {};
    },
    [mutations_types.create_school](state, { res }) {
        state.createSchoolResult = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
