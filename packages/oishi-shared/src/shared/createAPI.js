import request from 'request';
import { isFunction } from 'lodash';
export default class CreateAPI {
    constructor(baseUrl, baseOptions) {
        this.baseUrl = baseUrl;
        this.baseOptions = baseOptions || {};
    }
    getJSON(endPoint, qs, options) {
        return this.__request(endPoint, Object.assign({ method: 'get', qs }, options));
    }
    postJSON(endPoint, body, options) {
        return this.__request(endPoint, Object.assign({ method: 'post', body }, options));
    }
    __request(endPoint, options) {
        let currentOptions = Object.assign(Object.assign({}, this.baseOptions), (options || {}));
        if (isFunction(currentOptions.handleOption))
            currentOptions = currentOptions.handleOption(currentOptions);
        return new Promise((resolve) => {
            request(Object.assign({ baseUrl: this.baseUrl, uri: endPoint }, currentOptions), (error, response, body) => {
                error &&
                    isFunction(currentOptions.handleError) &&
                    currentOptions.handleError(error, response);
                isFunction(currentOptions.handleResp)
                    ? resolve(currentOptions.handleResp(body))
                    : resolve(body);
            });
        });
    }
}
