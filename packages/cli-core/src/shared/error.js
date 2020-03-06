"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OishiError extends Error {
    static creeate(msg) {
        return msg instanceof Error
            ? new OishiError(msg.message, msg.stack)
            : new OishiError(msg);
    }
    constructor(msg, stack) {
        super();
        this.name = 'oishiError';
        this.message = msg;
        stack && (this.stack = stack);
    }
}
exports.default = {
    createError(msg) {
        return OishiError.creeate(msg);
    },
};
