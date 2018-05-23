import api from '@/api'
import {CLEAR_STATE} from '../mutation_types';
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
    [CLEAR_STATE](state) {
        state.current_school = {};
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}