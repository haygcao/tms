import axios from 'axios';
import qs from 'qs';


async function create(payload) {
    const response = await axios.post('/api/franchisee/create',payload);
    return response.data;
}
/**
 * 
 * @param {{ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }} payload 
 */
async function list(payload) {
    const response = await axios.get('/api/franchisee/list', payload);
    return response.data.data;
}

async function getSchools(payload){
    const response = await axios.get('/api/franchisee/schools', payload);
    return response.data.data;
}
// async function getChildren(parent) {
//     const response = await axios.get('/api/regions/children', {
//         params: {
//             parent_id: parent
//         }
//     });
//     return response.data.data;
// }

export default {
    create,
    list,
    getSchools
}
