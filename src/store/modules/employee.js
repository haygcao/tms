import api from '@/api'
const { employee } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {
    employee_list: "employee/list",
    employee_create: "employee/create",
    employee_detail: "employee/employee_detail",
    generateEmployeeNo: "employee/generateEmployeeNo",
    updateEmployee: "employee/updateEmployee",
    countEmployees: "employee/countEmployees",
}
const state = {
    employee_list: {},
    create_result: {},
    employee_detail: {},
    new_employee: {},
    employeeCountSummary: {},
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
        commit(mutations_types.employee_detail, { res })
        return Promise.resolve(res);
    },
    async generateEmployeeNo({ commit, dispatch, state, getters }, payload) {
        let res = await employee.generateEmployeeNo(payload);
        commit(mutations_types.generateEmployeeNo, { res })
    },
    async updateEmployee({ commit, dispatch, state, getters }, payload) {
        let res = await employee.update(payload);
        commit(mutations_types.updateEmployee, { res })
        return Promise.resolve(res);
    },
    async countEmployees({ commit, dispatch, state, getters }, payload) {
        let res = await employee.countEmployees();
        commit(mutations_types.countEmployees, { res })
        return Promise.resolve(res);
    },
    async setEmployeeStateLeaved({ commit, dispatch, state, getters }, payload) {
        let res = await employee.setEmployeeStateLeaved(payload);
        // commit(mutations_types.updateEmployee, { res })
        return Promise.resolve(res);
    },
    async checkAccountExist({ commit, dispatch, state, getters }, payload) {
        let res = await employee.existAccount(payload);
        return Promise.resolve(res)
    },
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
    [mutations_types.countEmployees](state, { res }) {
        state.employeeCountSummary = res;
    },
    [mutations_types.updateEmployee](state, { res }) {
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