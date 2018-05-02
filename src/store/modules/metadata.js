import api from '@/api'
const { metadata } = api;
const mutations_types = {
    jobTitles: "metadata/jobTitles",
    educations: "metadata/educations",
}
const state = {
    jobTitles: [],
    educations: []
}
const getters = {

}
const actions = {
    async getJobTitles({ commit, state, getters }, payload) {
        console.log(metadata)
        let res = await metadata.titles();
        commit(mutations_types.jobTitles, { res })
    },
    async getEducations({ commit, state, getters }, payload) {
        let res = await metadata.educations();
        commit(mutations_types.educations, { res })
    }
}
const mutations = {
    [mutations_types.jobTitles](state, { res }) {
        state.jobTitles = res;
    },
    [mutations_types.educations](state, { res }) {
        state.educations = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}