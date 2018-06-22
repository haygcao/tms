import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/resource/courseware/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}

async function fetch(payload) {
    try {
        const response = await axios.get('/resource/courseware/fetch', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function remove(payload) {
    try {
        const response = await axios.get('/resource/courseware/remove', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '删除失败' }
    }

}
async function create(payload) {
    try {
        const response = await axios.post('/resource/courseware/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function update(payload) {
    try {
        const response = await axios.post('/resource/courseware/update', payload);
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
    remove,
}