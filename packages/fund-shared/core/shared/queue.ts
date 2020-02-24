export default class Queue {
  target: number;
  fns: Function[];
  finalFn: Function;

  constructor(fns: Function[] = []) {
    this.target = -1;
    this.fns = fns;
    // 当队列处理完成，有的时候需要给到通知
    this.finalFn = () => {};
  }

  push(fn: Function) {
    this.fns.push(fn);
    return this;
  }

  next() {
    this.target++;
    this.execute();
  }

  execute() {
    if (this.fns.length > this.target) {
      this.fns[this.target](this.next.bind(this));
    } else {
      this.finalFn();
    }
  }

  final(callback: Function) {
    this.finalFn = callback;
  }
}
