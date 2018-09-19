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

async function searchVisibledClazzList(payload) {
    try {
        const response = await axios.get('/api/clazz/search', {
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
async function remove(payload) {
    try {
        const response = await axios.post('/api/clazz/remove', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
async function close(payload) {
    try {
        const response = await axios.post('/api/clazz/close', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
async function setClazzVisibleState(payload) {
    try {
        const response = await axios.post('/api/clazz/set_visible_state', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
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
/**
 * 
 * @param { id, clazz_id, begin_time, end_time, class_date} payload 
 */
async function updateCurriculumScheduleTime(payload) {
    try {
        const response = await axios.post('api/clazz/schedules/update_time', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }
}
async function getTeacherInfo(payload) {
    try {
        const response = await axios.get('/api/teacher/info', { params: payload });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
/**
 * 
 * @param {{clazz_id}} payload 
 */
async function getClazzStudent(payload) {
    try {
        const response = await axios.get('/api/clazz/student_list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}
export default {
    list,
    create,
    findById,
    getTeacherInfo,
    remove,
    close,
    setClazzVisibleState,
    searchVisibledClazzList,
    getClazzStudent,
    updateCurriculumScheduleTime
}