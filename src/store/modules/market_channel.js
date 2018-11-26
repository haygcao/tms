import api from '@/api'
// import * as types from '../mutation_types'

const { market_channel, market_sub_channel } = api;
//mutations types
const mutations_types = {
    created: "market_channel/create",
    fetch: "market_channel/fetch",
    list: "market_channel/list",
    all: "market_channel/all"
}


const state = {
    list: {},
    all:{}
}

const getters = {

}
const actions = {

    async createMarketChannel({ commit, state }, payload) {
        let res = await market_channel.create(payload);
        return res

    },
    async updateMarketChannel({ commit, state, getters }, payload) {
        let res = await market_channel.update(payload);
        return res;

    },
    async getMarketChannelList({ commit, state, getters }, payload) {
        let res = await market_channel.list(payload);
        commit(mutations_types.list, { res })
        return res;
    },
    async getAllMarketChannelList({ commit, state, getters }, payload) {
        let res = await market_channel.findAll(payload);
        commit(mutations_types.all, { res })
        return res;
    },
    async getMarketChannelById({ commit, state, getters }, payload) {
        let res = await market_channel.fetch(payload);
        return res;
    },
    async getMarketChannelByName({ commit, state, getters }, payload) {
        let res = await market_channel.findByName(payload);
        return res;
    },
    async updateMarketSubChannel({ commit, state, getters }, payload) {
        let res = await market_sub_channel.update(payload);
        return res;

    },
    async createMarketSubChannel({ commit, state, getters }, payload) {
        let res = await market_sub_channel.create(payload);
        return res;

    },
    async getMarketSubChannelByName({ commit, state, getters }, payload) {
        let res = await market_sub_channel.findByName(payload);
        return res;
    },
    async getMarketSubChannelById({ commit, state, getters }, payload) {
        let res = await market_sub_channel.fetch(payload);
        return res;
    },
}
const mutations = {

    [mutations_types.all](state, { res }) {
        state.all = res;
    },
    [mutations_types.list](state, { res }) {
        state.list = res;
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}
