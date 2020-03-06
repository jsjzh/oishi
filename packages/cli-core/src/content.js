"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("./shared/logger"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const error_1 = tslib_1.__importDefault(require("./shared/error"));
const task_list_1 = tslib_1.__importDefault(require("./shared/task-list"));
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = function (v, k) {
    return hasOwnProperty.call(v, k);
};
exports.createContext = function (ctx) {
    const context = {
        root: '',
        http: axios_1.default,
        logger: logger_1.default,
        argv: {},
    };
    context.helper = Object.assign(Object.assign({}, error_1.default), task_list_1.default);
    const userContext = typeof ctx === 'object' ? ctx : ctx(context);
    Object.keys(userContext || {}).forEach(k => {
        if (k === 'root') {
            context.root = userContext.root;
        }
        else if (k === 'helper') {
            Object.assign(context.helper, userContext.helper);
        }
        else if (!hasOwn(context, k)) {
            context[k] = userContext[k];
        }
    });
    return context;
};
