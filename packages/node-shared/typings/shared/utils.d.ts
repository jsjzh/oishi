/// <reference types="node" />
import { ExecSyncOptionsWithStringEncoding } from 'child_process';
export declare const successExit: () => never;
export declare const errorExit: () => never;
export declare const realType: (obj: any) => string;
export declare const runLineCmdSyncCreater: (cwd?: string) => (cmd: string, options?: ExecSyncOptionsWithStringEncoding & {
    showExecuteCmd?: boolean | undefined;
}) => string;
