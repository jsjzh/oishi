declare type IFn = (...rests: any) => any;
export default class Queue {
    target: number;
    fns: IFn[];
    finalFn: IFn;
    constructor(fns?: IFn[]);
    init(): void;
    push(fn: IFn): this;
    next(): void;
    execute(): void;
    final(callback: IFn): void;
}
export {};
