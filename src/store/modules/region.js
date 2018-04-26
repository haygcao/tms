import api from '@/api'
// import * as types from '../mutation_types'

const region = api.region;
// import { host } from '../../api/constants'
//mutations types
const mutations_types = {
    received_region: "region.received",
    received_provinces: "region.received_provinces"
}


const state = {
    regions: [],
    provinces: [],

}

const getters = {
    provinceList: state => {
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
    // // provinceList: state => state.regions.filter(p => p.parent_id = '1'),
    children: (state) => (id) => {
        let l = state.regions.filter(p => p.parent_id === id);
        return l;
    }
}
const actions = {

    async getRegions({ commit, state }, payload) {
        let res = await region.getRegions();
        // await this.dispatch('provinces');
        commit(mutations_types.received_region, { res })

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
