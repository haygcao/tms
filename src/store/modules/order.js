import api from '@/api'
const { clazz, course, student, purchase } = api;
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
    createStudentResult: {},
    addStudentParentResult: {},
    createOrderResult: {},
    orderSummaryInfo: {},
    payOfflineResult: {},
    orderList: {},
    cancelOrderResult: {},
}
const getters = {

}
const actions = {
    async getStudentByMobile({ commit, state, getters }, payload) {
        let res = await student.findByMobile(payload);
        commit(mutations_types.order_student, { res })
        return Promise.resolve(res);
    },
    async checkStudentExist({ commit, state, getters }, payload) {
        let res = await student.findByMobile(payload);
        return Promise.resolve(res);
    },
    async createStudent({ commit, state, getters }, payload) {
        let res = await student.create(payload);
        commit(mutations_types.create_student, { res });
        return Promise.resolve(res);
    },
    async payOffline({ commit, state, getters }, payload) {
        let res = await purchase.payOffline(payload);
        commit(mutations_types.payOffline, { res });
    },
    async getOrderList({ commit, state, getters }, payload) {
        let res = await purchase.getOrderList(payload);
        commit(mutations_types.getOrderList, { res });
    },
    async cancelOrder({ commit, state, getters }, payload) {
        let res = await purchase.cancelOrder(payload);
        commit(mutations_types.cancelOrder, { res });
    },
    async createOrder({ commit, state, getters, dispatch }, payload) {
        if (payload.student) {
            let student = await dispatch('createStudent', payload.student);
            if (student) {
                payload.order.student_id = student.id;
                payload.order.student_name = student.name;
                let res = await purchase.createOrder(payload.order);
                commit(mutations_types.create_order, { res })
            }
        } else {
            payload.order.student_id = state.student.data.id;
            payload.order.student_name = state.student.data.name;
            let res = await purchase.createOrder(payload.order);
            commit(mutations_types.create_order, { res })
        }
    },
    async fetchOrderById({ commit, state, getters }, payload) {
        let res = await purchase.getOrderById(payload);
        commit(mutations_types.fetch_order, { res });
    },
    async fetchCourseLesson({ commit, state, getters }, payload) {
        let res = await purchase.getCourse(payload);
        commit(mutations_types.course_fetched, { res })
    },
    async addStudentParent({ commit, state, getters }, payload) {
        let res = await student.addParent(payload);
        commit(mutations_types.create_student_parent, { res })
    },
    async clearOrderCreateStates({ commit, state, getters }) {
        commit(mutations_types.clear_state)
    }
}
const mutations = {
    [mutations_types.order_student](state, { res }) {
        state.student = res;
    },
    [mutations_types.create_student](state, { res }) {
        state.createStudentResult = res;
    },
    [mutations_types.course_fetched](state, { res }) {
        state.course = res;
    },
    [mutations_types.create_student_parent](state, { res }) {
        state.addStudentParentResult = res;
    },
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
        state.createStudentResult = {};
        state.addStudentParentResult = {}

    },
}
export default {
    state,
    getters,
    actions,
    mutations
}