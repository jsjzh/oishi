import { Logger } from './shared/logger';
import { ErrorHelper } from './shared/error';
import { TaskListHelper } from './shared/task-list';
import { DynamicObject } from '../global';
export declare type Context<CTX> = {
    root: string;
    logger: Logger;
    helper: ErrorHelper & TaskListHelper;
    argv: DynamicObject;
} & CTX;
export declare const createContext: <CTX extends DynamicObject<any>>(root: string, ctx: CTX | ((ctx: Context<CTX>) => CTX)) => Context<CTX>;
