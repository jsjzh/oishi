import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'query-string';
import JSONP from 'jsonp';
import ExtendableError from 'es6-error';

class APIError extends ExtendableError {
  constructor(message = '') {
    super(message);
  }
}

type IRequestConfig = AxiosRequestConfig & {
  handleOption?: (option: AxiosRequestConfig) => any;
  handleResp?: (data: any) => any;
};

type IRequestResult<T> = Promise<T> & {
  promise: Promise<T>;
  cancel: () => void;
};

axios.defaults.withCredentials = true;

const { CancelToken } = axios;

const noop = () => {};

class CreateAPI {
  host: string;
  baseConfig: IRequestConfig;

  constructor(host: string, baseConfig: IRequestConfig = {}) {
    this.host = host;
    this.baseConfig = baseConfig;
  }

  request<T = any>(
    endPoint: string,
    reqConfig: IRequestConfig = {},
  ): IRequestResult<T> {
    const config = { ...this.baseConfig, reqConfig };
    const url = CreateAPI.getAPIUrl(this.host, endPoint);

    const {
      handleOption,
      handleResp = (resp: any) => resp,
      ...reqOpts
    } = config;

    let cancel = noop;

    let opts: AxiosRequestConfig = {
      cancelToken: new CancelToken(c => (cancel = c)),
      ...reqOpts,
    };

    opts = typeof handleOption === 'function' && handleOption(opts);

    const promise = axios(url, opts)
      .then(this.checkStatus)
      .then(resp => resp.data)
      .then(this.chekcResp)
      .then(resp => handleResp(resp))
      .catch(err => {
        if (axios.isCancel(err)) {
          console.warn(`请求取消：${endPoint}`);
          return;
        }
        throw err;
      }) as IRequestResult<T>;

    promise.promise = promise;
    promise.cancel = cancel;

    return promise;
  }

  checkStatus(resp: AxiosResponse) {
    if (resp.status >= 200 && resp.status < 300) {
      return resp;
    }

    throw new APIError(`[${resp.status}] 请求错误 ${resp.config.url}`);
  }

  chekcResp(data: any) {
    return data;

    // if (data.success) {
    //   return data;
    // }

    // throw new APIError(`[${data.code}] 请求失败 ${data.msg}`);
  }

  getJSON<T = any>(
    endpoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'get',
      params: data,
    });
  }

  postJSON<T = any>(
    endpoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'post', data });
  }

  postForm<T = any>(
    endpoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'post',
      data: qs.stringify(data),
    });
  }

  putJSON<T = any>(
    endpoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'put', data });
  }

  patchJSON<T = any>(
    endpoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'patch', data });
  }

  deleteJSON<T = any>(
    endpoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'delete', data });
  }

  jsonp<T = any>(
    endPoint: string,
    config: Pick<IRequestConfig, 'handleResp'> = {},
  ): Promise<T> {
    const { handleResp = (resp: any) => resp.data } = config;
    return new Promise((resolve, reject) => {
      const url = CreateAPI.getAPIUrl(this.host, endPoint);

      JSONP(
        url,
        { prefix: `__${url.replace(/[^\w\d]/g, '')}` },
        (err: Error | null, resp: any) => {
          if (err) return reject(err);
          if (!resp.success) {
            return reject(new APIError(`[${resp.code}] 请求失败 ${resp.msg}`));
          }
          resolve(handleResp(resp));
        },
      );
    });
  }

  static getAPIUrl(prefix: string, endpoint: string) {
    const url = `${prefix}/${endpoint}`;
    const re = new RegExp(`/+(${endpoint.replace(/^\/+/, '')})`);
    return url.replace(re, '/$1');
  }
}

export default CreateAPI;
