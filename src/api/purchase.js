
import axios from 'axios';
async function getCourse(payload) {
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
async function getOrderById(payload) {
    try {
        const response = await axios.get('/api/purchase/order/show', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function payOffline(payload) {
    try {
        const response = await axios.post('/api/purchase/order/payoffline', payload);
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '提交失败' }
    }
}
async function getOrderList(payload) {
    try {
        const response = await axios.get('/api/purchase/order/list', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }
}
async function cancelOrder(payload) {
    try {
        const response = await axios.get('/api/purchase/order/cancel', {
            params: payload
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '请求失败' }
    }
}
export default {
    getCourse,
    createOrder,
    getOrderById,
    getOrderList,
    payOffline,
    cancelOrder,

}