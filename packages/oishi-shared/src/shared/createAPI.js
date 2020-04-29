"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = tslib_1.__importDefault(require("request"));
const lodash_1 = require("lodash");
class CreateAPI {
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
        if (lodash_1.isFunction(currentOptions.handleOption))
            currentOptions = currentOptions.handleOption(currentOptions);
        return new Promise((resolve, reject) => {
            request_1.default(Object.assign({ baseUrl: this.baseUrl, uri: endPoint }, currentOptions), (error, response, body) => {
                error &&
                    lodash_1.isFunction(currentOptions.handleError) &&
                    currentOptions.handleError(error, response);
                lodash_1.isFunction(currentOptions.handleResp)
                    ? resolve(currentOptions.handleResp(body))
                    : resolve(body);
            });
        });
    }
}
exports.default = CreateAPI;
