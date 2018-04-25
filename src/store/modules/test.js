import { account } from '@/api'
const mutations_types = {
    received_regions: "login.regions",
}
const state = {
    regions: []
}
const getters = {
    regions: state => state.regions
}
const mutations = {
    [mutations_types.received_regions](state, { data }) {
        state.regions = data;
    },
    INCREMENT_MAIN_COUNTER(state) {
        state.main++
    }
}

const actions = {
    async getAreas({ commit }, params) {
        let res = await Promise.resolve(["a", "b"])
        commit(mutations_types.received_regions, { data: res })
    },
    someAsyncTask({ commit }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
