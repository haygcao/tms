import api from '@/api'
const { clazz, course } = api;
import { CLEAR_STATE } from '../mutation_types';
const mutations_types = {
    clazz_list: "clazz/list",
    clazz_fetch: "clazz/fetchedById",
    clazz_create: "clazz/create",
    course_fetched: "clazz/course_fetched",
    clear_state: "clazz/clear_state",
    teacher_info: "clazz/fetch_teacher_info",
    clazz_close:"clazz/clazz_close",
    clazz_remove:"clazz/clazz_remove",
    clazz_set_visible_state:"clazz/clazz_set_visible_state",
    visibled_clazz_list:"clazz/visibled_clazz_list"
}
const state = {
    clazzList: {},
    course: {},
    createResult: {},
    selectedClazz: {},
    teacherInfo: {},
    clazzListVisibled:{},
}
const getters = {

}
const actions = {
    async getClazzById({ commit, state, getters }, payload) {
        let res = await clazz.findById(payload);
        commit(mutations_types.clazz_fetch, { res })
    },
    async getClazzList({ commit, state, getters }, payload) {
        let res = await clazz.list(payload);
        commit(mutations_types.clazz_list, { res })
        return Promise.resolve(res);
    },
    async searchVisibledClazzList({ commit, state, getters }, payload) {
        let res = await clazz.searchVisibledClazzList(payload);
        commit(mutations_types.visibled_clazz_list, { res })
        return Promise.resolve(res);
    },
    async getTeacherInfo({ commit, state, getters }, payload) {
        let res = await clazz.getTeacherInfo(payload);
        commit(mutations_types.teacher_info, { res })
    },
    async fetchCourse({ commit, state, getters }, payload) {
        let res = await course.fetch(payload);
        commit(mutations_types.course_fetched, { res })
    },
    //关闭班级
    async closeClazz({ commit, state, getters }, payload) {
        let res = await clazz.close(payload);
        commit(mutations_types.clazz_close, { res, payload })
        return Promise.resolve(res)
    },
    //删除班级
    async removeClazz({ commit, state, getters }, payload) {
        let res = await clazz.remove(payload);
        commit(mutations_types.clazz_remove, { res })
        return Promise.resolve(res)
    },
    //设置班级显示状态
    async setClazzVisibleState({ commit, state, getters }, payload) {
        let res = await clazz.setClazzVisibleState(payload);
        commit(mutations_types.clazz_set_visible_state, { res, payload })
        return Promise.resolve(res)
    },
    //新建班级
    async createClazz({ commit, state, getters }, payload) {
        let res = await clazz.create(payload);
        commit(mutations_types.clazz_create, { res })
    },
    async clearClazzCreateStates({ commit, state, getters }) {
        commit(mutations_types.clear_state)
    }
}
const mutations = {
    [mutations_types.clazz_list](state, { res }) {
        state.clazzList = res;
    },
    
    [mutations_types.visibled_clazz_list](state, { res }) {
        state.clazzListVisibled = res;
    },
    [mutations_types.clazz_fetch](state, { res }) {
        state.selectedClazz = res;
    },
    [mutations_types.course_fetched](state, { res }) {
        state.course = res;
    },
    [mutations_types.clazz_create](state, { res }) {
        state.createResult = res;
    },
    [mutations_types.clazz_close](state, { res, payload }) {

        let cls = state.clazzList.data.rows.find(v => v.id == payload.clazz_id);
        cls.state = 99;
    },
    [mutations_types.clazz_set_visible_state](state, { res, payload }) {
        let cls = state.clazzList.data.rows.find(v => v.id == payload.clazz_id);
        cls.visible = payload.visible;
    },
    [mutations_types.clazz_remove](state, { res }) {
        // state.createResult = res;
    },
    [mutations_types.teacher_info](state, { res }) {
        state.teacherInfo = res;
    },
    [mutations_types.clear_state](state) {
        state.course = {};
        state.createResult = {}
    },
    [CLEAR_STATE](state) {
        state.course = {};
        state.createResult = {};
        state.clazzList = {};
        state.teacherInfo = {};
        state.clazzListVisibled={};
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}