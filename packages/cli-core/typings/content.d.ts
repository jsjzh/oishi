import { Logger } from './shared/logger';
import { AxiosInstance } from 'axios';
import { ErrorHelper } from './shared/error';
import { TaskListHelper } from './shared/task-list';
export declare type Context<CTX> = {
    root: string;
    http: AxiosInstance;
    logger: Logger;
    helper: ErrorHelper & TaskListHelper;
    argv: DynamicObject;
} & CTX;
export declare const createContext: <CTX extends DynamicObject<any>>(root: string, ctx: CTX | ((ctx: Context<CTX>) => CTX)) => Context<CTX>;
