function HttpHeaderInterceptor(Vue, options) {
    if (!Vue.axios || !Vue.http) {
        throw new Error('Vue.axios or Vue.http must be set.');
    }

    let axios = Vue.axios;
    let store = options.store;
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        if (store && store.state.current_user.current_school) {
            config.headers['x-school-id'] = store.state.current_user.current_school.id;

        }
        return config;
    });

    start = true;
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
                HttpHeaderInterceptor(_vue, _opts)
            }
        }
    })
}


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default plugin;