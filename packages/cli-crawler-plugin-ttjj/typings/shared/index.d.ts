/// <reference types="ts-toolbelt" />
export declare const curryGetAbsolutePath: import("Function/Curry").Curry<(root: string, inputPath: string) => string>;
export declare const curryTimePath: import("Function/Curry").Curry<(basePath: string, filePath: string) => string>;
export declare const sleep: (second: number) => Promise<unknown>;
export declare const getCodePath: (basePath: string, code: string, name: string) => string;
