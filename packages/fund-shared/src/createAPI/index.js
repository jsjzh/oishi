"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const url_1 = tslib_1.__importDefault(require("url"));
const query_string_1 = tslib_1.__importDefault(require("query-string"));
const jsonp_1 = tslib_1.__importDefault(require("jsonp"));
const es6_error_1 = tslib_1.__importDefault(require("es6-error"));
class APIError extends es6_error_1.default {
    constructor(message = '') {
        super(message);
    }
}
axios_1.default.defaults.withCredentials = true;
class CreateAPI {
    constructor(baseURL, baseConfig = {}, baseData = {}) {
        this.host = baseURL;
        this.baseConfig = baseConfig;
        this.baseData = baseData;
        this.instance = axios_1.default.create({ baseURL });
    }
    checkStatus(resp) {
        if (resp.status >= 200 && resp.status < 300)
            return resp;
        throw new APIError(`[${resp.status}] 请求错误 ${resp.config.url}`);
    }
    chekcResp(data) {
        return data;
        // if (data.success) return data;
        // throw new APIError(`[${data.code}] 请求失败 ${data.msg}`);
    }
    request(endPoint, reqConfig = {}) {
        const config = Object.assign(Object.assign({}, this.baseConfig), { reqConfig });
        const { handleOption, handleResp = (resp) => resp } = config, reqOpts = tslib_1.__rest(config, ["handleOption", "handleResp"]);
        const opts = typeof handleOption === 'function' ? handleOption(reqOpts) : reqConfig;
        const promise = this.instance(endPoint, opts)
            .then(this.checkStatus)
            .then(resp => resp.data)
            .then(this.chekcResp)
            .then(handleResp);
        return promise;
    }
    getJSON(endPoint, data = {}, config) {
        return this.request(endPoint, Object.assign(Object.assign({}, config), { method: 'get', params: Object.assign(Object.assign({}, data), this.baseData) }));
    }
    postJSON(endPoint, data = {}, config) {
        return this.request(endPoint, Object.assign(Object.assign({}, config), { method: 'post', data: Object.assign(Object.assign({}, data), this.baseData) }));
    }
    postForm(endPoint, data = {}, config) {
        return this.request(endPoint, Object.assign(Object.assign({}, config), { method: 'post', data: query_string_1.default.stringify(Object.assign(Object.assign({}, data), this.baseData)) }));
    }
    putJSON(endPoint, data = {}, config) {
        return this.request(endPoint, Object.assign(Object.assign({}, config), { method: 'put', data: Object.assign(Object.assign({}, data), this.baseData) }));
    }
    patchJSON(endPoint, data = {}, config) {
        return this.request(endPoint, Object.assign(Object.assign({}, config), { method: 'patch', data: Object.assign(Object.assign({}, data), this.baseData) }));
    }
    deleteJSON(endPoint, data = {}, config) {
        return this.request(endPoint, Object.assign(Object.assign({}, config), { method: 'delete', data: Object.assign(Object.assign({}, data), this.baseData) }));
    }
    jsonp(endPoint, config = {}) {
        const { handleResp = (resp) => resp.data } = config;
        return new Promise((resolve, reject) => {
            const url = url_1.default.resolve(this.host, endPoint);
            jsonp_1.default(url, { prefix: `__${url.replace(/[^\w\d]/g, '')}` }, (err, resp) => {
                if (err)
                    return reject(err);
                if (!resp.success) {
                    return reject(new APIError(`[${resp.code}] 请求失败 ${resp.msg}`));
                }
                resolve(handleResp(resp));
            });
        });
    }
}
exports.default = CreateAPI;
