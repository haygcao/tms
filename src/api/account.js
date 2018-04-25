import axios from 'axios';
import qs from 'qs';

async function getAccounts(headers = {}) {
    const response = await axios.post('/api/accounts', null, headers);
    return response.data.data;
}

async function login(user) {
    try {
        const res = await axios.post('/account/token', user);
        return res.data
    } catch (err) {
        return res.data;
    }

}
async function logout() {
    return { success: true };
}
export default {
    getAccounts,
    login,
    logout
}
