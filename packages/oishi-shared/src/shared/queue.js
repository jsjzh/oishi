export default class Queue {
    constructor(fns = []) {
        this.target = -1;
        this.fns = fns;
        this.finalFn = this.init;
    }
    init() {
        this.target = -1;
    }
    push(fn) {
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
        }
        else {
            this.finalFn();
        }
    }
    final(callback) {
        this.finalFn = callback;
        this.init();
    }
}
