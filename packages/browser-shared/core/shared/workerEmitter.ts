import { utils } from '@oishi/shared';

interface IListener {
  once?: boolean;
  callback: (...args: any[]) => any;
}

const noop = () => {};

export default class WorkerEmitter {
  static PROMISE_FLAG = '__PROMISE__';
  static PROMISE_DONE = '__DONE__';

  private listeners: { [k: string]: IListener[] };
  private worker: Worker | Window;

  constructor(worker: Worker | Window) {
    this.listeners = {};
    this.worker = worker;
    this.worker.addEventListener('message', this._emit.bind(this));
  }

  /**
   * 增加一个 type 的监听
   * @param {string} type type
   * @param {function} callback callback
   */
  on(type: string, callback: (data: any) => void) {
    Array.isArray(this.listeners[type]) || (this.listeners[type] = []);

    this.listeners[type].push({ callback });
  }

  /**
   * 增加一个 type 的监听，只监听一次
   * @param {string} type typ
   * @param {function} callback callback
   */
  once(type: string, callback: (data: any) => void) {
    Array.isArray(this.listeners[type]) || (this.listeners[type] = []);

    this.listeners[type].push({ once: true, callback });
  }

  /**
   * 删除一个 type 的所有监听
   * @param {string} type type
   */
  remove(type: string) {
    this.listeners[type] = [];
  }

  /**
   * 发送信息
   * @param {string} type type
   * @param {any} data data
   */
  emit(type: string, data: any) {
    if (typeof document === undefined) {
      (this.worker as unknown as Worker).postMessage({
        _type: type,
        _data: data,
      });
    } else {
      this.worker.postMessage({ _type: type, _data: data }, '*');
    }
  }

  /**
   * 以 promise 的方式获取数据，由于 promise 的限制，只支持单次处理
   * @param {string} type type
   * @param {any} data data
   * @returns Promise
   */
  async promise(type: string, data: any) {
    return new Promise((resolve, reject) => {
      this.once(`${WorkerEmitter.PROMISE_DONE}${type}`, resolve);
      this.emit(`${WorkerEmitter.PROMISE_FLAG}${type}`, data);
    });
  }

  /**
   * 需要 return 一个值，该值会当做 promise 回传的数据
   * @param {string} type type
   * @param {function} callback callback
   */
  onPromise(type: string, callback: (data: any) => any) {
    this.once(`${WorkerEmitter.PROMISE_FLAG}${type}`, callback);
  }

  /**
   * 内部使用的触发，外部不调用
   * @param {Event} event event
   */
  private async _emit(event: Event) {
    const { data } = event as Event & { data: { _type: string; _data: any } };
    const { _type, _data } = data;
    if (
      Array.isArray(this.listeners[_type]) &&
      this.listeners[_type].length > 0
    ) {
      for (let index = 0; index < this.listeners[_type].length; index++) {
        const listener = this.listeners[_type][index];
        const { once, callback } = listener;

        const result = utils.realType.isAsyncFunction(callback)
          ? await callback(_data)
          : callback(_data);

        if (_type.startsWith(WorkerEmitter.PROMISE_FLAG)) {
          const type = _type.slice(WorkerEmitter.PROMISE_FLAG.length);
          this.emit(`${WorkerEmitter.PROMISE_DONE}${type}`, result);
        }

        once && (this.listeners[_type][index] = { callback: noop });
      }
    }
  }
}
