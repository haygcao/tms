import axios from 'axios';

async function update(payload) {
    const response = await axios.post('/api/market/channel/sub/update', payload);
    return response.data;
}
async function fetch(payload) {
    const response = await axios.get('/api/market/channel/sub/fetch', {
        params: payload
    });
    return response.data;
}
async function findByName(payload) {
    const response = await axios.get('/api/market/channel/sub/find_by_name', {
        params: payload
    });
    return response.data;
}
async function create(payload) {
    try {
        const response = await axios.post('/api/market/channel/sub/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}

export default {
    create,
    fetch,
    update,
    findByName
}