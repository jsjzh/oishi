import { __rest } from "tslib";
import axios from 'axios';
import url from 'url';
import { stringify } from 'query-string';
import { isFunction } from 'lodash';
import { Logger } from '../helper';
const APPCODE = '---「CreateAPI」---';
const logger = new Logger(APPCODE);
class CreateAPIError extends Error {
    constructor(message) {
        super();
        this.name = APPCODE;
        this.message = message;
    }
}
export default class CreateAPI {
    constructor(baseURL, baseOptions) {
        this.baseURL = baseURL;
        this.baseOptions = baseOptions || {};
    }
    static create(baseURL, baseOptions = {}) {
        return new CreateAPI(baseURL, baseOptions);
    }
    getJSON(endPoint, params, options) {
        return this.request(endPoint, Object.assign(Object.assign({}, options), { method: 'get', params }));
    }
    postJSON(endPoint, data, options) {
        return this.request(endPoint, Object.assign(Object.assign({}, options), { method: 'post', data }));
    }
    postForm(endPoint, data, options) {
        return this.request(endPoint, Object.assign(Object.assign({}, options), { method: 'post', data: stringify(data) }));
    }
    putJSON(endpoint, data, options) {
        return this.request(endpoint, Object.assign(Object.assign({}, options), { method: 'put', data }));
    }
    patchJSON(endpoint, data, options) {
        return this.request(endpoint, Object.assign(Object.assign({}, options), { method: 'patch', data }));
    }
    deleteJSON(endpoint, data, options) {
        return this.request(endpoint, Object.assign(Object.assign({}, options), { method: 'delete', data }));
    }
    request(endPoint, options = {}) {
        const _a = Object.assign(Object.assign({}, this.baseOptions), options), { handleOptions, handleResp, handleError } = _a, reqOpts = __rest(_a, ["handleOptions", "handleResp", "handleError"]);
        let cancel = () => { };
        let opts = Object.assign({ withCredentials: true, cancelToken: new axios.CancelToken((c) => (cancel = c)) }, reqOpts);
        if (isFunction(handleOptions))
            opts = handleOptions(opts) || opts;
        const url = this.__formatURL(this.baseURL, endPoint);
        const promise = axios(url, opts)
            .then(this.__checkStatus)
            .then((resp) => resp.data)
            .then(this.__checkResp)
            .then((resp) => (isFunction(handleResp) ? handleResp(resp) : resp))
            .catch((err) => {
            if (axios.isCancel(err)) {
                logger.warn('request cancel');
                logger.warn(`url: ${url}`);
                logger.warn(`opts: ${JSON.stringify(opts)}`);
                return;
            }
            if (err && isFunction(handleError)) {
                handleError(err);
                return;
            }
            logger.error(err);
            throw new CreateAPIError('request error');
        });
        promise.promise = promise;
        promise.cancel = cancel;
        return promise;
    }
    __formatURL(baseURL, endPoint = '') {
        const urlInfo = url.parse(url.resolve(baseURL, endPoint));
        urlInfo.protocol || (urlInfo.protocol = 'https:');
        return url.format(urlInfo);
    }
    __checkStatus(resp) {
        if (resp.status >= 200 && resp.status < 300) {
            return resp;
        }
        logger.error('request error');
        logger.error(`resp: ${resp}`);
        throw new CreateAPIError(`response status error`);
    }
    __checkResp(data) {
        return data;
    }
}
