import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/course/clazz_type/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function update(payload) {
    const response = await axios.post('/api/course/clazz_type/update', payload);
    return response.data;
}
async function fetch(payload) {
    const response = await axios.get('/api/course/clazz_type/fetch', {
        params: payload
    });
    return response.data;
}

async function create(payload) {
    try {
        const response = await axios.post('/api/course/clazz_type/create', payload);
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
}