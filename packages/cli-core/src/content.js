import logger from './shared/logger';
import errorHelper from './shared/error';
import taskListHelper from './shared/task-list';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = function (v, k) {
    return hasOwnProperty.call(v, k);
};
export const createContext = function (root, ctx) {
    const context = {
        root: root,
        logger: logger,
        argv: {},
    };
    context.helper = Object.assign(Object.assign({}, errorHelper), taskListHelper);
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
