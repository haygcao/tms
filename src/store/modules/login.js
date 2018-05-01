import api from '@/api'
import * as types from '../mutation_types'

const account = api.account;
// import { host } from '../../api/constants'
//mutations types
const do_login_back = "login/login_back";
const fetch_user_info="login/fetch_user_info"
const state = {
    // regions: [],
    // captchImgUrl: null,
    // flag: null,
    loginResult: null,
    userInfo:null,
}

const getters = {

}
const actions = {

    async login({ commit, state,dispatch }, payload) {

        // return new Promise((resolve) => {
        //     account.login(payload).then(loginResult => {
        //         commit(do_login_back, { loginResult });

        //         return resolve(loginResult);
        //     });

        // })
        let loginResult =await account.login(payload);
        // if(loginResult.token){
        //     await dispatch('profile');
        // }
        commit(do_login_back, { loginResult });
        return Promise.resolve(loginResult);
       

    },


    async logout({ commit }, payload) {
        await account.logout();

        commit(types.CLEAR_STATE);
    },
    async profile({ commit }, payload) {
       let profile= await account.profile();

        commit(fetch_user_info, { profile });
    }
}
const mutations = {

    [do_login_back](state, { loginResult }) {
        state.loginResult = loginResult;
    },
    [fetch_user_info](state, { profile }) {
        state.userInfo = profile.data;
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
