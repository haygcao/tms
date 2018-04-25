import { account } from '@/api'
import * as types from '../mutation_types'


// import { host } from '../../api/constants'
//mutations types
const do_login_back = "login.login_back";
const state = {
    // regions: [],
    // captchImgUrl: null,
    // flag: null,
    loginResult: null
}

const getters = {

}
const actions = {

    async login({ commit, state }, payload) {
        let res = await account.login(payload);
        if (res && res.succeed) {
            commit(do_login_back, { res });
        }
        // return new Promise((resolve, reject) => {
        //     account.login(payload).then((loginResult) => {
        //         //state.loginResult = loginResult;
        //         commit(do_login_back, { loginResult });
        //         return resolve({ succeed: true, userInfo: loginResult.teacher, token: loginResult.token })
        //     }).catch((err) => {
        //         return reject({ succeed: false, message: err })
        //     })
        // })

    },
    async getAreas({ commit }, params) {
        let res = await region.getRegions(params)
        commit(mutations_types.received_regions, { data: res })
    },

    async logout({ commit }, payload) {
        await account.logout();
        commit(types.CLEAR_STATE);
    }
}
const mutations = {
    
    [do_login_back](state, { loginResult }) {
        state.loginResult = loginResult;
    },
    [types.CLEAR_STATE](state) {
        state.loginResult = null
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}
