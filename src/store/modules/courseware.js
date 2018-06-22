import api from '@/api'
// import * as types from '../mutation_types'

const { courseware } = api;
//mutations types
const mutations_types = {
    fetched: "courseware/fetched",
    created: "courseware/create",
    updated: "courseware/updated",
    removed: "courseware/removed",
    list: "courseware/list"
}


const state = {
    list: {},
    create_reulst: {},
    update_result: {},
    fetched_courseware:{}
}

const getters = {

}
const actions = {

    async createCourseware({ commit, state }, payload) {
        let res = await courseware.create(payload);
        // await this.dispatch('provinces');
        commit(mutations_types.created, { res })
        return Promise.resolve(res)

    },
    async updateCourseware({ commit, state, getters }, payload) {
        // let res = getters.children('1')
        let res = await courseware.update(payload);
        commit(mutations_types.updated, { res });
        return Promise.resolve(res)

    },
    async getCoursewareList({ commit, state, getters }, payload) {
        let res = await courseware.list(payload);
        commit(mutations_types.list, { res })

    },
    async getCourseware({ commit, state, getters }, payload) {
        let res = await courseware.fetch(payload);
        commit(mutations_types.fetched, { res });
        return Promise.resolve(res)
    },
    async removeCourseware({ commit, state, getters }, payload) {
        let res = await courseware.remove(payload);
        commit(mutations_types.removed, { res });
        return Promise.resolve(res)
    },
}
const mutations = {

    [mutations_types.created](state, { res }) {
        state.create_reulst = res;
    },
    [mutations_types.updated](state, { res }) {
        state.update_result = res;
    },
    [mutations_types.list](state, { res }) {
        state.list = res;
    },
    [mutations_types.fetched](state, { res }) {
        state.fetched_courseware = res;
    },
    [mutations_types.removed](state, { res }) {
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
