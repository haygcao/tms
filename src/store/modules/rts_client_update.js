import api from '@/api'
// import * as types from '../mutation_types'

const { rts_update } = api;
//mutations types
const mutations_types = {
    created: "rts_updates/create",
    release: "rts_updates/release",
    list: "rts_updates/list"
}


const state = {
    list: {},
}

const getters = {

}
const actions = {

    async createRTSClientVersion({ commit, state }, payload) {
        let res = await rts_update.create(payload);
        // await this.dispatch('provinces');
        // commit(mutations_types.created, { res })
        return res

    },
    async releaseRTSClient({ commit, state, getters }, payload) {
        let res = await rts_update.release(payload);
        return res;

    },
    async getRTSClientVersionList({ commit, state, getters }, payload) {
        let res = await rts_update.list(payload);
        commit(mutations_types.list, { res })
        return res;
    },
    async deleteRTSClientVersion({ commit, state, getters }, payload) {
        let res = await rts_update.remove(payload);
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
