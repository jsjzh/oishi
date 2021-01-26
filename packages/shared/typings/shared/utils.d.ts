export declare const sleep: (time: number) => Promise<unknown>;
export declare const retryPromise: <T = any, D = any>(promise: (data: D) => Promise<T>, data: D, handleResp: (resp: T) => boolean, maxRetryCount?: number) => Promise<void>;
export declare const asyncEvery: <T>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<boolean>;
export declare const asyncSome: <T>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<boolean>;
export declare const asyncForEach: <T>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<void>) => Promise<void>;
export declare const asyncMap: <T, P>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<P>) => Promise<P[]>;
export declare const asyncFind: <T>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<T | undefined>;
export declare const asyncFindIndex: <T>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<number | undefined>;
export declare const asyncFilter: <T>(arr: T[], callback: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<T[]>;
