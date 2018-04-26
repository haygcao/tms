import axios from 'axios';
import qs from 'qs';


async function getRegions() {
    const response = await axios.get('/api/regions', null);
    return response.data.data;
}
async function getProvinces() {
    const response = await axios.get('/api/regions/provinces', null);
    return response.data.data;
}
async function getChildren(parent) {
    const response = await axios.get('/api/regions/children', {
        params: {
            parent_id: parent
        }
    });
    return response.data.data;
}

export default {
    getRegions,
    getProvinces,
    getChildren
}
