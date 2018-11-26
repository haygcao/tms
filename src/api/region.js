import axios from 'axios';

import Cache from '@/lib/jsCache';
var cache = new Cache(-1, false, new Cache.LocalStorageCacheStorage('tms_data'));
async function getRegions() {
    let _cached = cache.getItem('allregions');
    if (_cached) {
        return _cached;
    }
    const response = await axios.get('/api/regions', null);
    if (response.data.code == 0 && response.data.data) {
        //缓存30天
        cache.setItem('allregions', response.data.data, { expirationAbsolute: new Date(Date.now() + 2592000000) })
    }
    return response.data.data;
}
function buildTree(arr, pid, maxDeep = 2) {
    var root = { region_id: pid };
    let deep = 0;
    var forFn = function (arr, father, lv) {
        if (lv > maxDeep)
            return;
        let children = arr.filter(v => v.parent_id == father.region_id);
        if (children) {
            father.children = children;
            for (var i = 0; i < father.children.length; i++) {
                father.children[i].deep = lv;
                forFn(arr, father.children[i], lv + 1)
            }
        }

    };
    forFn(arr, root, deep);
    return root;
}
async function getCityTree() {
    let _cached = cache.getItem('tree_cities');

    if (_cached) {
        return _cached;
    }
    const response = await axios.get('/api/regions', null);
    if (response.data.code == 0 && response.data.data) {
        let tree = buildTree(response.data.data, '1', 2)
        //缓存30天
        cache.setItem('tree_cities', tree.children, { expirationAbsolute: new Date(Date.now() + 2592000000) })
        return tree.children;
    }
    return [];
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
    getChildren,
    getCityTree
}
