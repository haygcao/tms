import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/course/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function create(payload) {
    try {
        const response = await axios.post('/api/course/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function remove(payload) {
    try {
        const response = await axios.post('/api/course/remove', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '删除失败' }
    }

}
async function fetch(payload) {
    try {
        const response = await axios.get('/api/course/fetch', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function detail(payload) {
    try {
        const response = await axios.get('/api/course/detail', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function setCourseware(payload) {
    try {
        const response = await axios.post('/api/course/detail/set_courseware', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function setHomework(payload) {
    try {
        const response = await axios.post('/api/course/detail/set_homework', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
export default {
    list,
    create,
    remove,
    fetch,
    detail,
    setCourseware,
    setHomework,
    
}