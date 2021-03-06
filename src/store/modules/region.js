import api from '@/api'
// import * as types from '../mutation_types'

const region = api.region;
// import { host } from '../../api/constants'
//mutations types
const mutations_types = {
    received_region: "region.received",
    received_provinces: "region.received_provinces",
    received_city_tree: "region.received_city_tree",
}


const state = {
    regions: [],
    provinces: [],
    cities_tree: [],
}

const getters = {
    provinceList: state => {
        if (!state.regions) {
            return []
        }
        let province = state.regions.filter(region => region.parent_id == '1');
        let list = province.map(v => {
            return { label: v.region_name, value: v.region_code, id: v.region_id, cities: [] }
        })
        for (let i = 0; i < list.length; i++) {
            let cities = state.regions.filter(p => p.parent_id === list[i].id);
            list[i].cities = cities.map(v => {
                return { label: v.region_name, value: v.region_code, id: v.region_id }
            })
        }
        return list;
    },
    regionName: (state) => (code) => {
        if (!state.regions) {
            return ''
        }
        let region = state.regions.find(p => p.region_code == code);
        if (region) {
            return region.region_name;
        }
    },
    // // provinceList: state => state.regions.filter(p => p.parent_id = '1'),
    children: (state) => (id) => {
        if (!state.regions) {
            return []
        }
        let l = state.regions.filter(p => p.parent_id === id);
        return l;
    },
}

const actions = {

    async getRegions({ commit, state }, payload) {
        let res = await region.getRegions();
        // await this.dispatch('provinces');
        commit(mutations_types.received_region, { res })
        return res;
    },
    async getCityTree({ commit, dispatch, state }, payload) {
        let res = await region.getCityTree();
        commit(mutations_types.received_city_tree, { res })
        return res;
    },
    async provinces({ commit, state, getters }, payload) {
        // let res = getters.children('1')
        let res = await region.getProvinces();
        commit(mutations_types.received_provinces, { res })

    },
}
const mutations = {

    [mutations_types.received_region](state, { res }) {
        state.regions = res;
    },
    [mutations_types.received_city_tree](state, { res }) {
        state.cities_tree = res;
    },
    [mutations_types.received_provinces](state, { res }) {
        state.provinces = res;
    },

}
export default {
    state,
    getters,
    actions,
    mutations
}
