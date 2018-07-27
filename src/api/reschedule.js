import axios from 'axios';
// router.post('/api/reschedule/create', controller.reschedule.create);
//   router.post('/api/reschedule/load_student_reschedules', controller.reschedule.loadStudentRescheduleList);
//   router.get('/api/reschedule/find_clazz_list', controller.reschedule.searchClazzListToReschedule);
async function findClazzListToReschedule(payload) {
    try {
        const response = await axios.get('/api/reschedule/find_clazz_list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}

async function create(payload) {
    try {
        const response = await axios.post('/api/reschedule/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
async function loadStudentReschedules(payload) {
    try {
        const response = await axios.post('/api/reschedule/load_student_reschedules', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
async function remove(payload) {
    try {
        const response = await axios.post('/api/reschedule/remove', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '失败' }
    }

}
export default {
    findClazzListToReschedule,
    create,
    loadStudentReschedules,
    remove,
}