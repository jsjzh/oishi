import { __rest } from "tslib";
import axios from 'axios';
import qs from 'query-string';
import JSONP from 'jsonp';
import ExtendableError from 'es6-error';
class APIError extends ExtendableError {
    constructor(message = '') {
        super(message);
    }
}
axios.defaults.withCredentials = true;
const { CancelToken } = axios;
const noop = () => { };
class CreateAPI {
    constructor(host, baseConfig = {}) {
        this.host = host;
        this.baseConfig = baseConfig;
    }
    request(endPoint, reqConfig = {}) {
        const config = Object.assign(Object.assign({}, this.baseConfig), { reqConfig });
        const url = CreateAPI.getAPIUrl(this.host, endPoint);
        const { handleOption, handleResp = (resp) => resp } = config, reqOpts = __rest(config, ["handleOption", "handleResp"]);
        let cancel = noop;
        let opts = Object.assign({ cancelToken: new CancelToken(c => (cancel = c)) }, reqOpts);
        opts = typeof handleOption === 'function' && handleOption(opts);
        const promise = axios(url, opts)
            .then(this.checkStatus)
            .then(resp => resp.data)
            .then(this.chekcResp)
            .then(resp => handleResp(resp))
            .catch(err => {
            if (axios.isCancel(err)) {
                console.warn(`请求取消：${endPoint}`);
                return;
            }
            throw err;
        });
        promise.promise = promise;
        promise.cancel = cancel;
        return promise;
    }
    checkStatus(resp) {
        if (resp.status >= 200 && resp.status < 300) {
            return resp;
        }
        throw new APIError(`[${resp.status}] 请求错误 ${resp.config.url}`);
    }
    chekcResp(data) {
        return data;
        // if (data.success) {
        //   return data;
        // }
        // throw new APIError(`[${data.code}] 请求失败 ${data.msg}`);
    }
    getJSON(endpoint, data = {}, config) {
        return this.request(endpoint, Object.assign(Object.assign({}, config), { method: 'get', params: data }));
    }
    postJSON(endpoint, data = {}, config) {
        return this.request(endpoint, Object.assign(Object.assign({}, config), { method: 'post', data }));
    }
    postForm(endpoint, data = {}, config) {
        return this.request(endpoint, Object.assign(Object.assign({}, config), { method: 'post', data: qs.stringify(data) }));
    }
    putJSON(endpoint, data = {}, config) {
        return this.request(endpoint, Object.assign(Object.assign({}, config), { method: 'put', data }));
    }
    patchJSON(endpoint, data = {}, config) {
        return this.request(endpoint, Object.assign(Object.assign({}, config), { method: 'patch', data }));
    }
    deleteJSON(endpoint, data = {}, config) {
        return this.request(endpoint, Object.assign(Object.assign({}, config), { method: 'delete', data }));
    }
    jsonp(endPoint, config = {}) {
        const { handleResp = (resp) => resp.data } = config;
        return new Promise((resolve, reject) => {
            const url = CreateAPI.getAPIUrl(this.host, endPoint);
            JSONP(url, { prefix: `__${url.replace(/[^\w\d]/g, '')}` }, (err, resp) => {
                if (err)
                    return reject(err);
                if (!resp.success) {
                    return reject(new APIError(`[${resp.code}] 请求失败 ${resp.msg}`));
                }
                resolve(handleResp(resp));
            });
        });
    }
    static getAPIUrl(prefix, endpoint) {
        const url = `${prefix}/${endpoint}`;
        const re = new RegExp(`/+(${endpoint.replace(/^\/+/, '')})`);
        return url.replace(re, '/$1');
    }
}
export default CreateAPI;
