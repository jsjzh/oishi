"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(fns = []) {
        this.target = -1;
        this.fns = fns;
        this.finalFn = () => { };
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
    }
}
exports.default = Queue;
