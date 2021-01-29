/// <reference types="node" />
import { ExecSyncOptionsWithStringEncoding } from 'child_process';
export declare const successExit: () => never;
export declare const errorExit: () => never;
export declare const runLineCmdSyncCreater: (cwd?: string) => (cmd: string, options?: Partial<ExecSyncOptionsWithStringEncoding> & {
    showExecuteCmd?: boolean | undefined;
}) => Buffer;
