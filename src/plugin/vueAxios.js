function plugin(Vue, axios) {
    if (plugin.installed) {
        return;
    }
    if (!axios) {
        console.error('You have to install axios')
        return
    }
    axios.defaults.headers.common['X-Client-ID'] = 'ra-reallyedu';
    Vue.http = Vue.axios = Vue.prototype.$http = axios
}
export default plugin