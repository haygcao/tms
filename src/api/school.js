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
// async function create(payload) {
//     try {
//         const response = await axios.post('/api/school/create',payload);
//         return response.data;
//     } catch (err) {
//         return { code: 500, data: {}, message: err.response.data.error || '保存失败' }
//     }

// }
export default {
    list,
    // create
}