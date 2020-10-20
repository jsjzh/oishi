export interface IDealConfig<T, K> {
  handleTimer?: () => Promise<any>;
  handleWhile: (data: T, resp: K | undefined) => Promise<boolean>;
  handleResp: (resp: K, data: T) => Promise<void>;
}

export default class RandomPromise<T = any, K = any> {
  promise: (data: T) => Promise<K>;
  data: T;
  config: IDealConfig<T, K>;

  __result: any;
  __resp: any;
  /**
   * 设置间隔对一个请求做处理
   * @param promise 一个函数，返回一个 promise 对象，一般为想要爬取数据的接口
   * @param data 请求所需的参数
   * @param config 各种 handle
   */
  constructor(
    promise: (data: T) => Promise<K>,
    data: T,
    config: IDealConfig<T, K>,
  ) {
    this.promise = promise;
    this.data = data;
    this.config = config;

    this.__result = null;
    this.__resp = null;
  }

  async handleTimer() {
    return typeof this.config.handleTimer === 'function'
      ? await this.config.handleTimer()
      : new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 * 3));
  }

  async handleWhile() {
    return !!(await this.config.handleWhile(this.data, this.__result));
  }

  async handleResp() {
    return await this.config.handleResp(this.__result, this.data);
  }

  async excute() {
    while (await this.handleWhile()) {
      await this.handleTimer();

      try {
        this.__resp = await this.promise(this.data);
      } catch (error) {
        throw new Error('接口访问错误，可能已被限制访问');
      }

      try {
        this.__result = JSON.parse(this.__resp);
      } catch (error) {
        this.__result = this.__resp;
      }

      await this.handleResp();
    }
  }
}
