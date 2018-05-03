// mport IO from "socket.io-client";
// import ReconnectingWebSocket from 'reconnectingwebsocket'

const httpLoadingInspector = function (Vue) {
    Vue.http.interceptors.request.use(function (req) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('http.loading', { "detail": { "stage": 'pending' } }))
        }
        return req
    }, function (error) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('http.loading', { "detail": { "stage": 'complete' } }))
        }
        return Promise.reject(error);
    });
    Vue.http.interceptors.response.use(function (res) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('http.loading', { "detail": { "stage": 'complete' } }))
        }
        return res;
    }, function (error) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('http.loading', { "detail": { "stage": 'complete' } }))
        }
        return Promise.reject(error);
    });
}
var plugins = {

    install(Vue, opts) {

        httpLoadingInspector(Vue)
        let addListeners = function () {
            if (this.$options["loading"]) {
                let conf = this.$options.loading;


                if (conf.inspecters && conf.inspecters.length > 0) {

                }
            }
        };

        let removeListeners = function () {
            if (this.$options["loading"]) {
                let conf = this.$options.loading;


                if (conf.inspecters && conf.inspecters.length > 0) {
                    conf.inspecters = []
                }
            }
        };

        Vue.mixin({

            // Vue v2.x
            beforeCreate: addListeners,


            beforeDestroy: removeListeners
        });

    }

};
export default plugins
