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
export default {
    createError(msg) {
        return OishiError.creeate(msg);
    },
};
