import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/student/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function create(payload) {
    try {
        const response = await axios.post('/api/student/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function findByMobile(payload) {
    try {
        const response = await axios.get('/api/student/find', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function addParent(payload) {
    try {
        const response = await axios.post('/api/student/add_parent', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }
}

export default {
    list,
    create,
    findByMobile,
    addParent
   
}