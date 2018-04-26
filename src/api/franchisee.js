import axios from 'axios';
import qs from 'qs';


async function create(payload) {
    const response = await axios.post('/api/franchisee/create',payload);
    return response.data;
}
// async function list() {
//     const response = await axios.get('/api/regions/provinces', null);
//     return response.data.data;
// }
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

}
