import axios from 'axios';
/**
 * 
 * @param {{student_id}}} payload 
 */
async function getStudentClazzList(payload) {
    try {
        const response = await axios.get('/api/transfer_clazz/student_clazz_list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}

async function transfer(payload) {
    try {
        const response = await axios.post('/api/transfer_clazz/transfer', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
/**
 * 
 * @param {{clazz_id}} payload 
 */
async function searchClazzListToTransfer(payload) {
    try {
        const response = await axios.get('/api/transfer_clazz/find_to_clazz_list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
/**
 * 
 * @param {{student_id,limit,offset}} payload 
 */
async function getStudentTransferClazzLog(payload) {
    try {
        const response = await axios.get('/api/transfer_clazz/transfer_log', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }

}

export default {
    getStudentClazzList,
    transfer,
    searchClazzListToTransfer,
    getStudentTransferClazzLog
}