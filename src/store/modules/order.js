import api from '@/api'
const { clazz, course, student, purchase } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {
    order_student: "order/fetch_student",
    create_student: 'order/create_student',
    create_order: "order/create_order",
    create_student_parent: "order/create_student_parent",
    course_fetched: "order/course_fetched",
    clear_state: "order/clear_state",
    fetch_order: "order/fetch_order",
    payOffline: "order/payOffline",
    getOrderList: "order/getOrderList",
    cancelOrder: "order/cancelOrder",
}
const state = {
    // clazzList: {},
    course: {},
    student: {},
    // createStudentResult: {},
    // addStudentParentResult: {},
    createOrderResult: {},
    orderSummaryInfo: {},
    payOfflineResult: {},
    orderList: {},
    cancelOrderResult: {},
}
const getters = {

}
const actions = {
    async getOrderStudentByMobile({ commit, state, getters }, payload) {
        let res = await student.findByMobile(payload);
        // commit(mutations_types.order_student, { res })
        return Promise.resolve(res);
    },
    // async checkStudentExist({ commit, state, getters }, payload) {
    //     let res = await student.findByMobile(payload);
    //     return Promise.resolve(res);
    // },
    // async createStudent({ commit, state, getters }, payload) {
    //     let res = await student.create(payload);
    //     commit(mutations_types.create_student, { res });
    //     return Promise.resolve(res);
    // },
    async payOffline({ commit, state, getters }, payload) {
        let res = await purchase.payOffline(payload);
        commit(mutations_types.payOffline, { res });
        return Promise.resolve(res);
    },
    async getOrderList({ commit, state, getters }, payload) {
        let res = await purchase.getOrderList(payload);
        commit(mutations_types.getOrderList, { res });
    },
    async cancelOrder({ commit, state, getters }, payload) {
        let res = await purchase.cancelOrder(payload);
        commit(mutations_types.cancelOrder, { res });
        return Promise.resolve(res);
    },
    async createOrder({ commit, state, getters, dispatch }, payload) {
        
        let res = await purchase.createOrder(payload.order);
        commit(mutations_types.create_order, { res })
        return Promise.resolve(res);
    },
    async fetchOrderById({ commit, state, getters }, payload) {
        let res = await purchase.getOrderById(payload);
        commit(mutations_types.fetch_order, { res });
        return Promise.resolve(res);
    },
    async fetchCourseLesson({ commit, state, getters }, payload) {
        let res = await purchase.getCourse(payload);
        commit(mutations_types.course_fetched, { res });
        return Promise.resolve(Object.assign({},res));
    },
    // async addStudentParent({ commit, state, getters }, payload) {
    //     let res = await student.addParent(payload);
    //     commit(mutations_types.create_student_parent, { res })
    // },
    async clearOrderCreateStates({ commit, state, getters }) {
        commit(mutations_types.clear_state)
    }
}
const mutations = {
    [mutations_types.order_student](state, { res }) {
        state.student = res;
    },
    // [mutations_types.create_student](state, { res }) {
    //     state.createStudentResult = res;
    // },
    [mutations_types.course_fetched](state, { res }) {
        state.course = res;
    },
    // [mutations_types.create_student_parent](state, { res }) {
    //     state.addStudentParentResult = res;
    // },
    [mutations_types.create_order](state, { res }) {
        state.createOrderResult = res;
    },
    [mutations_types.fetch_order](state, { res }) {
        state.orderSummaryInfo = res;
    },
    [mutations_types.payOffline](state, { res }) {
        state.payOfflineResult = res;
    },
    [mutations_types.getOrderList](state, { res }) {
        state.orderList = res;
    },
    [mutations_types.cancelOrder](state, { res }) {
        state.cancelOrderResult = res;
    },
    [mutations_types.clear_state](state) {
        state.course = {};
        state.student = {};
        // state.createStudentResult = {};
        // state.addStudentParentResult = {}

    },
    [CLEAR_STATE](state) {
        state.course = {};
        state.student = {};
        // state.createStudentResult = {};
        // state.addStudentParentResult = {};
        state.createOrderResult = {};
        state.orderSummaryInfo = {};
        state.payOfflineResult = {};
        state.orderList = {};
        state.cancelOrderResult = {};

    },
}
export default {
    state,
    getters,
    actions,
    mutations
}