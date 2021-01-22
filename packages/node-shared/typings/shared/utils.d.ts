/// <reference types="node" />
import { ExecSyncOptionsWithStringEncoding } from 'child_process';
export declare const successExit: () => never;
export declare const errorExit: () => never;
export declare const realType: (obj: any) => string | null;
export declare const isBoolean: (obj: any) => boolean;
export declare const runLineCmdSync: (cwd?: string) => (cmd: string, options?: ExecSyncOptionsWithStringEncoding & {
    showExecuteCmd: boolean;
    showStdio: boolean;
}) => string;
