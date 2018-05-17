import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/clazz/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function create(payload) {
    try {
        const response = await axios.post('/api/clazz/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function findById(payload) {
    try {
        const response = await axios.get('/api/clazz/show', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function updateClassroom(payload) {
    try {
        const response = await axios.post('/api/classroom/update', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function removeClassroom(payload) {
    try {
        const response = await axios.post('/api/classroom/remove', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }
}
async function getClassroomList(payload) {
    try {
        const response = await axios.get('/api/classroom/list', { params: payload });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function getClassroom(payload) {
    try {
        const response = await axios.get('/api/classroom/show', { params: payload });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
export default {
    list,
    create,
    findById,
    // getClassroomList,
    // removeClassroom,
    // updateClassroom,
    // getClassroom,
}