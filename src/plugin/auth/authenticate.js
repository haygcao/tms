import { objectExtend, decodeBase64, compare, isObject } from './util.js'
import CookieStorage from './cookie-storage.js';
const AUTH_EVENTS = {
    LOGIN: 'AUTH.LOGIN',
    LOGOUT: 'AUTH.LOGOUT',
    UNAUTHORIZED: 'AUTH.UNAUTHORIZED',
    FORBIDDEN: 'AUTH.FORBIDDEN',
    REFRESH: 'AUTH.REFRESH'
}
const syncUserStore = function (store, auth, options) {
    let moduleName = (options || {}).moduleName || 'user'

    store.registerModule(moduleName, {
        state: { data: null },
        mutations: {
            'auth/user_fetched': function (state, data) {
                store.state[moduleName] = data;
            },
            'auth/user_removed': function (state) {
                store.state[moduleName] = { data: null };
            },
        }
    })
    auth.watch.$on(AUTH_EVENTS.LOGIN, function (user) {
        store.commit('auth/user_fetched', user)
    })
    auth.watch.$on(AUTH_EVENTS.LOGOUT, function () {
        store.commit('auth/user_removed')
    })

}
class Authenticate {
    constructor(Vue, options) {
        let _defaultOpt = {
            tokenType: 'Bearer',
            storagePrefix: '_auth',
            loginPath: '/login',
            forbiddenPath: '/403',
            logoutRedirect: '/',
            rolesVar: 'roles',
            tokenStorage: new CookieStorage({}),
            tokenName: 'token',
            tokenHeader: 'Authorization',
            refreshToken: { enable: true, action: 'refresh' },
        }
        this.options = objectExtend(_defaultOpt, options);
        this.options.Vue = Vue;
        if (!this.options.Vue.router)
            this.options.Vue.router = options.router;
        this.watch = new this.options.Vue({
            data: function () {
                return {
                    data: null,
                    // loaded: false,
                    // redirect: null,
                    authenticated: null
                };
            }
        });
        let self = this;
        this.watch.$on(AUTH_EVENTS.LOGOUT, function (ev) {
            self.watch.$data.data = null;
            self.watch.$data.authenticated = false;
            if (self.options.Vue.router) {
                let to = self.options.Vue.router.currentRoute;
                if ( to.path != self.options.loginPath) {
                    self.options.Vue.router.replace({ path: self.options.logoutRedirect, query: { redirect: to.fullPath } })

                }
            }
        });
        this.watch.$on(AUTH_EVENTS.LOGIN, function (payload) {
            self.watch.data = payload;
            self.watch.authenticated = true;
        });
        this.watch.$on(AUTH_EVENTS.UNAUTHORIZED, function (data) {
            if (self.options.Vue.router) {
                let to = self.options.Vue.router.currentRoute;

                let event = new CustomEvent(AUTH_EVENTS.UNAUTHORIZED, { detail: data });
                window.dispatchEvent(event);
                if (to.path != self.options.loginPath) {
                    self.options.Vue.router.replace({ path: self.options.loginPath, query: { redirect: to.fullPath } })

                }
            }
        });
        if (this.options.refreshToken && this.options.refreshToken.enable) {
            this.watch.$on(AUTH_EVENTS.REFRESH, function () {
                if (self.options.store) {
                    self.options.store.dispatch(self.options.refreshToken.action || 'refresh').then(res => {
                        self.watch.$emit(AUTH_EVENTS.UNAUTHORIZED);
                    }, err => {
                        self.watch.$emit(AUTH_EVENTS.UNAUTHORIZED);
                    });
                }
            })
        }
        if (this.options.store) {
            syncUserStore(this.options.store, this);
        }

        this.__routerInterceptor();
        this.__httpInterceptor();
    }
    get tokenStorage() {
        return this.options.tokenStorage;
    }
    get tokenName() {

        return this._storageKey(this.options.tokenName)
    }
    get emitter() {
        return this.watch;
    }
    get user() {
        if (this.isAuthenticated()) {
            // 这里使用 tokenstore 的数据，否则刷新后会丢失
            //return this.watch.data;
            return this.getPayload()
        }
        return null;
    }

    getToken() {
        return this.tokenStorage.getItem(this.tokenName)
    }
    setToken(token) {
        this.tokenStorage.setItem(this.tokenName, token)
    }
    removeToken() {
        return this.tokenStorage.removeItem(this.tokenName)
    }
    login(token, rememberMe) {

        this.setToken(token);
        let payload = this.getPayload();
        if (rememberMe) {
            this.rememberMe(rememberMe)
        }

        this.watch.$emit(AUTH_EVENTS.LOGIN, payload || {});
    }
    logout() {
        this.removeToken();
        let remember = this.rememberMe();
        if (remember && !remember.rememberMe) {
            this.removeRememberMe();
        }
        this.watch.$emit(AUTH_EVENTS.LOGOUT);
    }
    isAuthenticated(role) {

        if (this._checkAuthenticated()) {
            if (role) {
                return compare(role, this.watch.data[this.options.rolesVar]);
            }

            return true;
        }

        return false;
    }
    isInRole(roles) {
        return compare(roles, this.watch.data[this.options.rolesVar]);
    }
    rememberMe(user) {
        if (user && user.userName) {
            let data = { user: user, rememberMe: true }
            return this.tokenStorage.setItem(this._storageKey('rememberMe'), JSON.stringify(data), 12096e5);//14d
        } else {
            return this.tokenStorage.getItem(this._storageKey('rememberMe'));
        }
    }
    removeRememberMe() {
        return this.tokenStorage.removeItem(this._storageKey('rememberMe'));
    }
    getPayload() {
        const token = this.getToken();

        if (token && token.split('.').length === 3) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(decodeBase64(base64));
            } catch (e) { }
        }
    }
    _storageKey(name) {

        if (this.options.storagePrefix) {
            return [this.options.storagePrefix, name].join('_')
        } else {
            return name;
        }
    }
    _checkAuthenticated() {
        let token = this.getToken();

        if (token) {  // Token is present
            if (token.split('.').length === 3) {  // Token with a valid JWT format XXX.YYY.ZZZ
                try { // Could be a valid JWT or an access token with the same format
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace('-', '+').replace('_', '/');
                    const exp = JSON.parse(window.atob(base64)).exp;
                    if (typeof exp === 'number') {  // JWT with an optonal expiration claims
                        return Math.round(new Date().getTime() / 1000) < exp;
                    }
                } catch (e) {
                    return true;  // Pass: Non-JWT token that looks like JWT
                }
            }
            return true;  // Pass: All other tokens
        }
        return false
    }


    __routerInterceptor() {
        let router = this.options.Vue.router;
        let auth = this;
        if (!router) {
            throw new Error('Vue.$auth: Vue.router must be set. set parameter [options.router]');
        }

        router.beforeEach((to, from, next) => {
            if (auth.watch.authenticated && !auth._checkAuthenticated()) {
                auth.logout();
            }
            if (auth.watch.authenticated && auth._checkAuthenticated()) {
                //刷新token 向后延长时间；
                if (auth.options.refreshToken && auth.options.refreshToken.enable) {
                    let payload = auth.getPayload();
                    let exp = payload.exp;
                    const rfb = 300;//5分钟
                    if (payload && exp && Math.round(new Date().getTime() / 1000) > exp - rfb) {
                        auth.watch.$emit(AUTH_EVENTS.REFRESH);
                    }
                }
            }
            let authRouter;
            var authRoutes = to.matched.filter(function (route) {
                return route.meta.hasOwnProperty('auth');
            });
            // matches the nested route, the last one in the list
            if (authRoutes.length) {
                authRouter = authRoutes[authRoutes.length - 1].meta.auth;
            }
            if (authRouter) {
                // this route requires auth, check if logged in
                // if not, redirect to login page.
                if (!auth.isAuthenticated()) {
                    next({
                        path: auth.options.loginPath,//'/login',
                        query: { redirect: to.fullPath }
                    })
                } else if (authRouter.constructor === Array && !auth.isInRole(authRouter)) {
                    next({
                        path: auth.options.forbiddenPath,//'/403',
                        query: { redirect: to.fullPath }
                    })
                }
                else {
                    next()
                }
            } else {
                next() // 确保一定要调用 next()
            }
        })

    }

    __httpInterceptor() {
        var auth = this;// Vue.auth;
        let Vue = auth.options.Vue;
        if (!Vue.axios) {
            throw new Error('Vue.axios must be set.');
        }
        const tokenHeader = auth.options.tokenHeader;

        function _requestIntercept(config) {
            if (auth.isAuthenticated()) {
                config.headers[tokenHeader] = [
                    auth.options.tokenType, auth.getToken()
                ].join(' ')
            } else {
                delete config.headers[tokenHeader]
            }
            return config
        }
        function _setHeaders(req, headers) {
            req.headers.common = Object.assign(req.headers.common, headers);
        }
        function _getHeaders(res) {
            return res.headers;
        }
        function _invalidToken(res) {
            if (res.status === 401) {
                return true;
            }
        }
        function _responseIntercept(res) {
            if (_invalidToken(res)) {
                auth.watch.$emit(AUTH_EVENTS.UNAUTHORIZED, res);
            }
            return res;
        }
        function _responseErrorIntercept(err) {
            let res = err.response || {};
            if (_invalidToken(res)) {
                auth.watch.$emit(AUTH_EVENTS.UNAUTHORIZED, res.data);
            }
            // console.log('response error interceptors=====>', err);
            return Promise.reject(err);
        }
        Vue.axios.interceptors.request.use(_requestIntercept);
        Vue.axios.interceptors.response.use(_responseIntercept, _responseErrorIntercept);

    }

}
export default Authenticate;