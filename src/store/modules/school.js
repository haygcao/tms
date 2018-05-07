import api from '@/api'
const { school } = api;
const mutations_types = {
    classroomList: "school/classroomList",
    createClassroom: "school/createClassroom",
    updateClassroom: "school/updateClassroom",
    removeClassroom: "school/removeClassroom",
    fetchClassroom: "school/fetchClassroom",
    getTeachers:"school/getTeachers",
}
const state = {
    classroomList: {},
    createClassroomResult: {},
    updateClassroomResult: {},
    selectedClassroom: {},
    schoolTeachers:{},
}
const getters = {

}
const actions = {

    async getClassroomList({ commit, state, getters }, payload) {
        const { school_id } = payload
        let res = await school.getClassroomList({ school_id });
        commit(mutations_types.classroomList, { res })
    },
    async createClassroom({ commit, dispatch, state, getters }, payload) {
        let res = await school.createClassroom(payload);
        commit(mutations_types.createClassroom, { res });
    },
    async updateClassroom({ commit, dispatch, state, getters }, payload) {
        let res = await school.updateClassroom(payload);
        commit(mutations_types.updateClassroom, { res });
    },
    async removeClassroom({ commit, dispatch, state, getters }, payload) {
        let res = await school.removeClassroom(payload);
        // commit(mutations_types.updateClassroom, { res });
        await dispatch("getClassroomList", { school_id: payload.school_id })
    },
    async fetchClassroom({ commit, dispatch, state, getters }, payload) {
        let res = await school.getClassroom(payload);
        commit(mutations_types.fetchClassroom, { res });
    },
    async getTeachers({ commit, dispatch, state, getters }, payload){
        let res = await school.getTeachers(payload);
        commit(mutations_types.getTeachers, { res });
    }
}
const mutations = {
    [mutations_types.classroomList](state, { res }) {
        state.classroomList = res;
    },
    [mutations_types.createClassroom](state, { res }) {
        state.createClassroomResult = res;
    },
    [mutations_types.updateClassroom](state, { res }) {
        state.updateClassroomResult = res;
    },
    [mutations_types.fetchClassroom](state, { res }) {
        state.selectedClassroom = res;
    },
    [mutations_types.getTeachers](state, { res }) {
        state.schoolTeachers = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}