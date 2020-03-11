import logger, { Logger } from './shared/logger';

import errorHelper, { ErrorHelper } from './shared/error';
import taskListHelper, { TaskListHelper } from './shared/task-list';
import { DynamicObject } from '../global';

export type Context<CTX> = {
  root: string;
  logger: Logger;
  helper: ErrorHelper & TaskListHelper;
  argv: DynamicObject;
} & CTX;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasOwn = function(v: {}, k: string): boolean {
  return hasOwnProperty.call(v, k);
};

export const createContext = function<CTX extends DynamicObject>(
  root: string,
  ctx: CTX | ((ctx: Context<CTX>) => CTX),
): Context<CTX> {
  const context = {
    root: root,
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
