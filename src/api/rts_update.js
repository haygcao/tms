import axios from 'axios';


async function create(payload) {
    try {
        const response = await axios.post('/api/rts_client/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
/**
 * 
 * @param {id} payload 
 */
async function release(payload) {
    try {
        const response = await axios.get('/api/rts_client/release', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
async function remove(payload) {
    try {
        const response = await axios.get('/api/rts_client/delete', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
async function list(payload) {
    try {
        const response = await axios.get('/api/rts_client/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }

}
export default {
    create,
    release,
    remove,
    list
}