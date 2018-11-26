import axios from 'axios';
// import qs from 'qs';

async function getAccounts(headers = {}) {
    const response = await axios.post('/api/accounts', null, headers);
    return response.data.data;
}

async function login(user) {
    try {
        const res = await axios.post('/account/token', user);
        return res.data
    } catch (err) {
        console.log(err);
        return { code: 500, message: '登录失败' };
    }

}
async function profile() {
    try {
        const res = await axios.get('/api/account/me');
        return res.data
    } catch (err) {
        console.log(err);
        return { code: 500, message: '获取数据失败' };
    }
}
async function logout() {
    const res = await axios.get('/account/logout');
    return res.data;
}
export default {
    getAccounts,
    login,
    logout,
    profile
}
