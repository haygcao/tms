function plugin(Vue, axios) {
    if (plugin.installed) {
        return;
    }
    if (!axios) {
        console.error('You have to install axios')
        return
    }
    Vue.http = Vue.axios = Vue.prototype.$http = axios
}
export default plugin