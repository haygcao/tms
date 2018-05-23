import api from '@/api'
const { employee } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {
    employee_list: "employee/list",
    employee_create: "employee/create",
    employee_detail: "employee/employee_detail",
    generateEmployeeNo: "employee/generateEmployeeNo"
}
const state = {
    employee_list: {},
    create_result: null,
    employee_detail: null,
    new_employee: null,
}
const getters = {

}
const actions = {
    async getEmployeeList({ commit, state, getters }, payload) {
        let res = await employee.list(payload);
        commit(mutations_types.employee_list, { res })
    },
    async createEmployee({ commit, dispatch, state, getters }, payload) {
        let res = await employee.create(payload);
        commit(mutations_types.employee_create, { res })
    },
    async getEmployee({ commit, dispatch, state, getters }, payload) {
        let res = await employee.show(payload);
        commit(mutations_types.employee_create, { res })
    },
    async generateEmployeeNo({ commit, dispatch, state, getters }, payload) {
        let res = await employee.generateEmployeeNo(payload);
        commit(mutations_types.generateEmployeeNo, { res })
    }
}
const mutations = {
    [mutations_types.employee_list](state, { res }) {
        state.employee_list = res;
    },
    [mutations_types.employee_detail](state, { res }) {
        state.employee_detail = res;
    },
    [mutations_types.generateEmployeeNo](state, { res }) {
        state.new_employee = res;
    },
    [mutations_types.employee_create](state, { res }) {
        state.create_result = res;
    },
    [CLEAR_STATE](state) {
        state.employee_list = {};
        state.create_result = null;
        state.employee_detail = null;
        state.new_employee = null;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}