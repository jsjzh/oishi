import logger, { Logger } from './shared/logger';
import axios, { AxiosInstance } from 'axios';

import errorHelper, { ErrorHelper } from './shared/error';
import taskListHelper, { TaskListHelper } from './shared/task-list';

export type Context<CTX> = {
  root: string;
  http: AxiosInstance;
  logger: Logger;
  helper: ErrorHelper & TaskListHelper;
  argv: DynamicObject;
} & CTX;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasOwn = function(v: {}, k: string): boolean {
  return hasOwnProperty.call(v, k);
};

export const createContext = function<CTX extends DynamicObject>(
  ctx: CTX | ((ctx: Context<CTX>) => CTX),
): Context<CTX> {
  const context = {
    root: '',
    http: axios,
    logger: logger,
    argv: {},
  } as any;

  context.helper = {
    ...errorHelper,
    ...taskListHelper,
  };

  const userContext = typeof ctx === 'object' ? ctx : ctx(context);

  Object.keys(userContext || {}).forEach(k => {
    if (k === 'root') {
      context.root = userContext.root;
    } else if (k === 'helper') {
      Object.assign(context.helper, userContext.helper);
    } else if (!hasOwn(context, k)) {
      context[k] = userContext[k];
    }
  });

  return context;
};
