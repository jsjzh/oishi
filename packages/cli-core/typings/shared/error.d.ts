declare class OishiError extends Error {
    static creeate(msg: string | Error): OishiError;
    constructor(msg: string, stack?: Error['stack']);
}
export interface ErrorHelper {
    createError(msg: string | Error): OishiError;
}
declare const _default: {
    createError(msg: string | Error): OishiError;
};
export default _default;
