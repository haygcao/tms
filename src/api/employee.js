import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/employee/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function create(payload) {
    try {
        const response = await axios.post('/api/employee/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function setEmployeeStateLeaved(payload) {
    try {
        const response = await axios.post('/api/employee/leave', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }
}
async function update(payload) {
    try {
        const response = await axios.post('/api/employee/update', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }
}
async function show(payload) {
    try {
        const response = await axios.get('/api/employee/show', { params: payload });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function generateEmployeeNo() {
    try {
        const response = await axios.get('/api/employee/generate_no');
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function existAccount(payload) {
    try {
        const response = await axios.get('/api/employee/exist_account', { params: payload });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: '请求失败' }
    }
}
async function countEmployees() {
    try {
        const response = await axios.get('/api/employee/counter');
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
export default {
    list,
    create,
    show,
    generateEmployeeNo,
    existAccount,
    setEmployeeStateLeaved,
    update,
    countEmployees,
}