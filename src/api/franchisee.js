import axios from 'axios';
import qs from 'qs';


async function create(payload) {
    const response = await axios.post('/api/franchisee/create', payload);
    return response.data;
}
/**
 * 
 * @param {{ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }} payload 
 */
async function list(payload) {
    const response = await axios.get('/api/franchisee/list', {
        params: {
            offset: payload.offset,
            limit: payload.limit
        }
    });
    return response.data.data;
}

async function getSchools(payload) {
    try {
        const response = await axios.get('/api/franchisee/schools', {
            params: {
                franchisee_id: payload.franchisee_id,
            }
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }


}

async function remove(payload) {
    try {
        const response = await axios.get('/api/franchisee/remove', {
            params: {
                franchisee_id: payload.franchisee_id,
            }
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '删除失败' }
    }


}
async function show(payload) {
    try {
        const response = await axios.get('/api/franchisee/schools', {
            params: {
                franchisee_id: payload.franchisee_id,
            }
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '获取失败' }
    }


}
async function addSchool(payload) {
    try {
        const response = await axios.post('/api/franchisee/school/create', payload);
        return response.data;
    } catch (err) {
        return { code: 500, message: err.response.data.error || '保存失败' };
    }
}
async function removeSchool(payload) {
    try {
        const response = await axios.get('/api/franchisee/school/remove', {
            params: {
                franchisee_id: payload.franchisee_id,
                school_id: payload.school_id
            }
        });
        return response.data;
    } catch (err) {
        return { code: 500, data: {}, message: err.response.data.error || '删除失败' }
    }


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
    remove,
    list,
    getSchools,
    addSchool,
    removeSchool,
    show
}
