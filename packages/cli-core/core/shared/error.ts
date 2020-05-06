class OishiError extends Error {
  static creeate(msg: string | Error): OishiError {
    return msg instanceof Error
      ? new OishiError(msg.message, msg.stack)
      : new OishiError(msg);
  }

  constructor(msg: string, stack?: Error['stack']) {
    super();
    this.name = '「oishi-cli-Error」';
    this.message = msg;
    stack && (this.stack = stack);
  }
}

export interface ErrorHelper {
  createError(msg: string | Error): OishiError;
}

export default {
  createError(msg: string | Error): OishiError {
    return OishiError.creeate(msg);
  },
};
