import api from '@/api'
const mutations_types = {
    switch_school: "currentUser/switch_school",
}
const state = {
    current_school: {},
}
const getters = {

}
const actions = {
    async switchSchool({ commit, state, getters }, payload) {
        
        commit(mutations_types.switch_school, { payload })
    },
}
const mutations = {
    [mutations_types.switch_school](state, { payload }) {
        state.current_school = payload;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}