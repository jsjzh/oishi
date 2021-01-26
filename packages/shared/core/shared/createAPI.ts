/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-this-alias */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import ExtendableError from 'es6-error';
import { resolve as urlResolve } from 'url';
import { stringify as qsStringify } from 'query-string';
import { isFunction } from 'lodash';
import jsonp from 'jsonp';
import { Logger } from '../helper';

type Platform =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd'
  | 'browser';

const APPCODE = '「CreateAPI」';
const logger = new Logger(APPCODE);

const isBrowser = (process.platform as Platform) === 'browser';

class CreateAPIError extends ExtendableError {
  constructor(message = '') {
    super(message);
  }
}

export type CreateAPIConfigs = AxiosRequestConfig & {
  handleResp?: (resp: any) => any;
  handleError?: (error: AxiosError) => any;
};

type IRequestResult<T> = Promise<T> & {
  promise: Promise<T>;
  cancel: () => void;
};

export default class CreateAPI {
  static create(baseUrl: string, baseConfigs?: CreateAPIConfigs) {
    return new CreateAPI(baseUrl, baseConfigs);
  }

  baseUrl: string;
  baseConfigs: CreateAPIConfigs;

  constructor(baseUrl: string, baseConfigs?: CreateAPIConfigs) {
    this.baseUrl = this.__formatBaseUrl(baseUrl);
    this.baseConfigs = baseConfigs || {};
  }

  getJSON<T = any>(
    endPoint: string,
    query?: { [k: string]: any },
    configs?: CreateAPIConfigs,
  ) {
    return this.request<T>(endPoint, {
      ...configs,
      method: 'get',
      params: query || {},
    });
  }

  postJSON<T = any>(
    endPoint: string,
    body: { [k: string]: any },
    configs?: CreateAPIConfigs,
  ) {
    return this.request<T>(endPoint, {
      ...configs,
      method: 'post',
      data: body,
    });
  }

  postForm<T = any>(
    endPoint: string,
    data: { [k: string]: any },
    configs?: CreateAPIConfigs,
  ) {
    return this.request<T>(endPoint, {
      ...configs,
      method: 'post',
      data: qsStringify(data),
    });
  }

  putJSON<T = any>(
    endPoint: string,
    data: { [k: string]: any },
    configs?: CreateAPIConfigs,
  ) {
    return this.request<T>(endPoint, {
      ...configs,
      method: 'put',
      data,
    });
  }

  patchJSON<T = any>(
    endPoint: string,
    data: { [k: string]: any },
    configs?: CreateAPIConfigs,
  ) {
    return this.request<T>(endPoint, {
      ...configs,
      method: 'patch',
      data,
    });
  }

  deleteJSON<T = any>(
    endPoint: string,
    data: { [k: string]: any },
    configs?: CreateAPIConfigs,
  ) {
    return this.request<T>(endPoint, {
      ...configs,
      method: 'delete',
      data,
    });
  }

  jsonp<T = any>(
    endPoint: string,
    configs?: Pick<CreateAPIConfigs, 'handleResp' | 'handleError'> & {
      timeout?: number;
    },
  ) {
    if (!isBrowser) {
      throw new CreateAPIError('当前未处于浏览器环境，无法使用 jsonp');
    }

    const { handleResp, handleError } = {
      ...this.baseConfigs,
      ...configs,
    };

    const url = this.__formatUrl(this.baseUrl, endPoint);

    const promise: Promise<T> = new Promise((resolve, reject) => {
      jsonp(
        url,
        {
          prefix: `__${this.baseUrl.replace(/[^\w\d]/g, '')}`,
          timeout: configs?.timeout,
        },
        (error, resp) => (error ? reject(error) : resolve(resp)),
      );
    })
      .then((resp: any) => (isFunction(handleResp) ? handleResp(resp) : resp))
      .catch((error) => {
        if (error && isFunction(handleError)) {
          handleError(error);
          return;
        }

        logger.error(error.message || error);
        throw error;
      }) as any;

    return promise;
  }

  request<T>(endPoint: string, configs: CreateAPIConfigs = {}) {
    const { handleResp, handleError, ...reqConfigs } = {
      ...this.baseConfigs,
      ...configs,
    };

    let cancel = () => {};

    const currentConfigs: AxiosRequestConfig = {
      withCredentials: true,
      // eslint-disable-next-line no-return-assign
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
      ...reqConfigs,
    };

    const url = this.__formatUrl(this.baseUrl, endPoint);

    const promise: IRequestResult<T> = axios(url, currentConfigs)
      .then((resp) => resp.data)
      .then(this.__checkResp)
      .then((resp) => (isFunction(handleResp) ? handleResp(resp) : resp))
      .catch((error) => {
        if (axios.isCancel(error)) {
          logger.warn(`请求取消：${url}`);
          return;
        }

        if (error && isFunction(handleError)) {
          handleError(error);
          return;
        }

        logger.error(error.message || error);
        throw error;
      }) as any;

    promise.promise = promise;
    promise.cancel = cancel;

    return promise;
  }

  private __formatBaseUrl(baseUrl: string) {
    const currentBaseUrl = baseUrl.trim();

    const flag =
      !currentBaseUrl.startsWith('https://') &&
      !currentBaseUrl.startsWith('http://');

    flag && logger.info('传入的 baseUrl 协议有误，将默认使用 https 协议');

    return flag ? `https://${currentBaseUrl}` : currentBaseUrl;
  }

  private __formatUrl(baseUrl: string, endPoint = '') {
    return urlResolve(baseUrl, endPoint.trim());
  }

  private __checkResp(data: any) {
    return data;
  }
}
