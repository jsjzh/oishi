"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
};
exports.cleanArgs = (cmd) => {
    const args = {};
    cmd.options.forEach((o) => {
        const key = exports.camelize(o.long.replace(/^--/, ''));
        typeof cmd[key] !== 'function' &&
            typeof cmd[key] !== 'undefined' &&
            (args[key] = cmd[key]);
    });
    return args;
};
