import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/market/channel/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function update(payload) {
    const response = await axios.post('/api/market/channel/update', payload);
    return response.data;
}
async function fetch(payload) {
    const response = await axios.get('/api/market/channel/fetch', {
        params: payload
    });
    return response.data;
}
async function findByName(payload) {
    const response = await axios.get('/api/market/channel/find_by_name', {
        params: payload
    });
    return response.data;
}
async function create(payload) {
    try {
        const response = await axios.post('/api/market/channel/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}

export default {
    list,
    create,
    fetch,
    update,
    findByName
}