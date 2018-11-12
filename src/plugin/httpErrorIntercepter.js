function HttpErrorInterceptor(Vue, options) {
    if (!Vue.axios || !Vue.http) {
        throw new Error('Vue.axios or Vue.http must be set.');
    }

    let axios = Vue.axios;
    let moduleName = (options || {}).moduleName || 'httpInterceptor'
    let store = options.store;
    store.registerModule(moduleName, {
        state: { error: null },
        mutations: {
            'httpInterceptor/Http_RESPONSE_ERROR': function (state, error) {
                store.state[moduleName] = storeHttpResponse(error);
            },
            'httpInterceptor/Http_RESPONSE_SUCCEED': function (state, res) {
                store.state[moduleName] = storeHttpResponse(res);
            },
            'httpInterceptor/Http_REQUESTING': function (state, res) {
                store.state[moduleName] = storeHttpResponse(res);
            }
        }
    })
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        store.commit('httpInterceptor/Http_REQUESTING', { config: config, status: 0, message: 'prepending' })
        return config;
    });
    axios.interceptors.response.use(_responseIntercept, _responseErrorIntercept);
    function _responseIntercept(res) {
        store.commit('httpInterceptor/Http_RESPONSE_SUCCEED', res)
        return res;
    }
    function _responseErrorIntercept(error) {
        if (error.response.status > 410) {
            error.response.data = { code: error.response.status, data: error.response.data }
        }
        store.commit('httpInterceptor/Http_RESPONSE_ERROR', error)
        return Promise.reject(error);
    }
    start = true;
}
function storeHttpResponse(response) {
    var err = {
        message: response.message,
    }
    if (response.statusText) {
        err.message = response.statusText;
    }
    if (response.status) {
        err.status = response.status;
    }

    if (response.config) {
        err.config = {
            url: response.config.url,
            headers: Object.assign({}, response.config.headers),
            method: response.config.method
        }
    }

    if (err.message && err.message == 'Network Error') {
        err.status = 999;
    }
    return Object.freeze(err);
}

let start = false;//只执行一次 interceptor
function plugin(Vue, options) {

    if (plugin.installed) {
        return;
    }

    options = options || {};

    let _vue = Vue;
    Vue.mixin({
        beforeCreate() {
            const _options = this.$options;
            if (_options.store && !start) {

                let _opts = Object.assign(options, { store: _options.store })
                HttpErrorInterceptor(_vue, _opts)
            }
        }
    })
}


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default plugin;