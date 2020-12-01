type IFn = (...rests: any) => any;

export default class Queue {
  target: number;
  fns: IFn[];
  finalFn: IFn;

  constructor(fns: IFn[] = []) {
    this.target = -1;
    this.fns = fns;
    // 当队列处理完成，有的时候需要给到通知
    this.finalFn = this.init;
  }

  init() {
    this.target = -1;
  }

  push(fn: IFn) {
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

  final(callback: IFn) {
    this.finalFn = callback;
    this.init();
  }
}
