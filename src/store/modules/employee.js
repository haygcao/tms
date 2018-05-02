import api from '@/api'
const { employee } = api;
const mutations_types = {
    employee_list: "employee/list",
    employee_create: "employee/create",
}
const state = {
    employee_list: {},
    create_result: null
}
const getters = {

}
const actions = {
    async getEmployeeList({ commit, state, getters }, payload) {
        let res = await employee.list(payload);
        commit(mutations_types.employee_list, { res })
    },
    async createEmployee({ commit,dispatch, state, getters }, payload) {
        let res = await employee.create(payload);
        commit(mutations_types.employee_create, { res })
    }
}
const mutations = {
    [mutations_types.employee_list](state, { res }) {
        state.employee_list = res;
    },
    [mutations_types.employee_create](state, { res }) {
        state.create_result = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}