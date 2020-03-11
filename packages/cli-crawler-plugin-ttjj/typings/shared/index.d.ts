/// <reference types="ts-toolbelt" />
import { IAllCode } from '..';
export declare const curryGetAbsolutePath: import("Function/Curry").Curry<(root: string, inputPath: string) => string>;
export declare const curryTimePath: import("Function/Curry").Curry<(basePath: string, filePath: string) => string>;
export declare const sleep: (second: number) => Promise<unknown>;
export declare const getCodePath: (basePath: string, code: string, name: string) => string;
export declare const createFundTasks: (title: string, codeLists: IAllCode[], savePath: string, request: <T = any>(data: {
    FundCode: string;
}) => Promise<T>) => {
    title: string;
    task: () => Promise<any>;
}[];
