import axios from 'axios';
import qs from 'qs';

async function getAccounts(headers = {}) {
    const response = await axios.post('/api/accounts', null, headers);
    return response.data.data;
}
async function getAreas() {
    return ['a', 'b']
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
async function logout() {
    return { success: true };
}
export default {
    getAccounts,
    getAreas,
    login,
    logout
}
