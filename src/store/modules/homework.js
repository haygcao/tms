import api from '@/api'
// import * as types from '../mutation_types'

const { homework } = api;
//mutations types
const mutations_types = {
    fetched: "homework/fetched",
    created: "homework/create",
    updated: "homework/updated",
    removed: "homework/removed",
    list: "homework/list"
}


const state = {
    list: {},
    create_reulst: {},
    update_result: {},
    fetched_homework:{}
}

const getters = {

}
const actions = {

    async createHomework({ commit, state }, payload) {
        let res = await homework.create(payload);
        // await this.dispatch('provinces');
        commit(mutations_types.created, { res })
        return Promise.resolve(res)

    },
    async updateHomework({ commit, state, getters }, payload) {
        // let res = getters.children('1')
        let res = await homework.update(payload);
        commit(mutations_types.updated, { res });
        return Promise.resolve(res)

    },
    async getHomeworkList({ commit, state, getters }, payload) {
        let res = await homework.list(payload);
        commit(mutations_types.list, { res })

    },
    async getHomework({ commit, state, getters }, payload) {
        let res = await homework.fetch(payload);
        commit(mutations_types.fetched, { res });
        return Promise.resolve(res)
    },
    async removeHomework({ commit, state, getters }, payload) {
        let res = await homework.remove(payload);
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
        state.fetched_homework = res;
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
