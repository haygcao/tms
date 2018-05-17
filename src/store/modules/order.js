import api from '@/api'
const { clazz, course, student, purchase } = api;
const mutations_types = {
    order_student: "order/fetch_student",
    create_student: 'order/create_student',
    create_order: "clazz/create_order",
    create_student_parent: "order/create_student_parent",
    course_fetched: "order/course_fetched",
    clear_state: "order/clear_state",
}
const state = {
    // clazzList: {},
    course: {},
    student: {},
    createStudentResult: {},
    addStudentParentResult: {},
    createOrderResult: {}
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
        debugger;
        let res = await student.create(payload);
        commit(mutations_types.create_student, { res });
        return Promise.resolve(res);
    },
    async createOrder({ commit, state, getters, dispatch }, payload) {
        if (payload.student) {
            let student = await dispatch('createStudent', payload.student);
            debugger;
            if (student) {
                payload.order.student_id = student.id;
                let res = await purchase.createOrder(payload.order);
                commit(mutations_types.create_order, { res })
            }
        } else {
            payload.order.student_id = state.student.data.id;
            let res = await purchase.createOrder(payload.order);
            commit(mutations_types.create_order, { res })
        }
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