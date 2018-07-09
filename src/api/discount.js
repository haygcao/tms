import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/discount/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}


async function create(payload) {
    try {
        const response = await axios.post('/api/discount/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function remove(payload) {
    try {
        const response = await axios.post('/api/discount/remove', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function update(payload) {
    try {
        const response = await axios.post('/api/discount/update', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
export default {
    list,
    create,
    remove,
    update
}