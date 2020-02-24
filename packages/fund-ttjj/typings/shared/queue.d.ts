export default class Queue {
    target: number;
    fns: Function[];
    finalFn: Function;
    constructor(fns?: Function[]);
    push(fn: Function): this;
    next(): void;
    execute(): void;
    final(callback: Function): void;
}
