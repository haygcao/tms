import axios from 'axios';
/**
 * 
 * @param {Object{students:Array,student_paretns:Array}} payload 
 */
async function create(payload) {
    try {
        const res = await axios.post('/api/customer/create', payload);
        return res.data
    } catch (err) {
        return err.response.data;
    }
}
async function fetch(payload) {
    try {
        const res = await axios.get('/api/customer/fetch', { params: payload });
        return res.data
    } catch (err) {
        return err.response.data;
    }
}
async function list(payload) {
    try {
        const res = await axios.get('/api/customer/search', { params: payload });
        return res.data
    } catch (err) {
        return err.response.data;
    }
}
/**
 * 
 * @param {Object {mobile:String}} payload 
 */
async function findByMobile(payload) {
    const res = await axios.get('/api/customer/student_parents/find_by_mobile', { params: payload });
    return res.data
}
async function getCommunicationsByCustomerId(payload) {
    try {
        const res = await axios.get('/api/customer/communication/fetch', { params: payload });
        return res.data
    } catch (err) {
        return err.response.data;
    }
}
async function searchCommunicationsList(payload) {
    try {
        const res = await axios.get('/api/customer/communication/search', { params: payload });
        return res.data
    } catch (err) {
        return err.response.data;
    }
}
async function createCommunication(payload) {
    try {
        const res = await axios.post('/api/customer/communication/create', payload);
        return res.data
    } catch (err) {
        return err.response.data;
    }
}
export default {
    list,
    create,
    findByMobile,
    fetch,
    getCommunicationsByCustomerId,
    searchCommunicationsList,
    createCommunication

}