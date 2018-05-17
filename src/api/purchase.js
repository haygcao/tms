
import axios from 'axios';
async function getCourse(payload){
    try {
        const response = await axios.get('/api/purchase/course', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function createOrder(payload) {
    try {
        const response = await axios.post('/api/purchase/order/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
    }

}
export default {
    getCourse,
    createOrder,
    // findById,
    
}