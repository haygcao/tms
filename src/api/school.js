import axios from 'axios';
async function list(payload) {
    try {
        const response = await axios.get('/api/school/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function createClassroom(payload) {
    try {
        const response = await axios.post('/api/classroom/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
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
async function getTeachers(payload) {
    try {
        // const response = await axios.get('/api/employee/teachers', { params: payload });
        const response = await axios.get('/api/employee/find_by_job_title', { params: Object.assign({ state: 1, job_title: 'teacher' }, payload) });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
async function getConsultants(payload) {
    try {
        const response = await axios.get('/api/employee/find_by_job_title', { params: Object.assign({ state: 1, job_title: 'consultant' }, payload) });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
export default {
    list,
    createClassroom,
    getClassroomList,
    removeClassroom,
    updateClassroom,
    getClassroom,
    getTeachers,
    getConsultants
}