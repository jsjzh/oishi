import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import url from 'url';
import { stringify } from 'query-string';
import { isFunction } from 'lodash';
import { Logger } from '../helper';
import jsonp from 'jsonp';

const APPCODE = '---「CreateAPI」---';

const logger = new Logger(APPCODE);

class CreateAPIError extends Error {
  constructor(message: string) {
    super();
    this.name = APPCODE;
    this.message = message;
  }
}

export type CreateAPIOptions<T = any> = AxiosRequestConfig & {
  handleOptions?: (options: AxiosRequestConfig) => AxiosRequestConfig;
  handleResp?: <T>(resp: T) => any;
  handleError?: (error: AxiosError) => any;
};

type IRequestResult<T> = Promise<T> & {
  promise: Promise<T>;
  cancel: () => void;
};

export default class CreateAPI {
  static create(baseURL: string, baseOptions: CreateAPIOptions = {}) {
    return new CreateAPI(baseURL, baseOptions);
  }

  baseURL: string;
  baseOptions: AxiosRequestConfig;

  constructor(baseURL: string, baseOptions?: CreateAPIOptions) {
    this.baseURL = baseURL;
    this.baseOptions = baseOptions || {};
  }

  getJSON<T = any>(
    endPoint: string,
    query: CreateAPIOptions<T>['params'],
    options?: CreateAPIOptions<T>,
  ) {
    return this.request<T>(endPoint, {
      ...options,
      method: 'get',
      params: query,
    });
  }

  postJSON<T = any>(
    endPoint: string,
    body: CreateAPIOptions<T>['data'],
    options?: CreateAPIOptions<T>,
  ) {
    return this.request<T>(endPoint, {
      ...options,
      method: 'post',
      data: body,
    });
  }

  postForm<T = any>(
    endPoint: string,
    data: CreateAPIOptions<T>['data'],
    options?: CreateAPIOptions<T>,
  ) {
    return this.request<T>(endPoint, {
      ...options,
      method: 'post',
      data: stringify(data),
    });
  }

  putJSON<T = any>(
    endpoint: string,
    data: CreateAPIOptions<T>['data'],
    options?: CreateAPIOptions<T>,
  ) {
    return this.request<T>(endpoint, { ...options, method: 'put', data });
  }

  patchJSON<T = any>(
    endpoint: string,
    data: CreateAPIOptions<T>['data'],
    options?: CreateAPIOptions<T>,
  ) {
    return this.request<T>(endpoint, { ...options, method: 'patch', data });
  }

  deleteJSON<T = any>(
    endpoint: string,
    data: CreateAPIOptions<T>['data'],
    options?: CreateAPIOptions<T>,
  ) {
    return this.request<T>(endpoint, { ...options, method: 'delete', data });
  }

  jsonp<T = any>(
    endpoint: string,
    data: CreateAPIOptions<T>['data'],
    options?: Pick<CreateAPIOptions<T>, 'handleResp' | 'handleError'> & {
      timeout?: number;
    },
  ) {
    const { handleResp, handleError } = {
      ...this.baseOptions,
      ...options,
    };

    const url = this.__formatURL(this.baseURL, endpoint);

    return new Promise<T>((resolve, reject) => {
      jsonp(
        url,
        {
          param: stringify(data),
          prefix: `__${this.baseURL.replace(/[^\w\d]/g, '')}`,
          timeout: options?.timeout,
        },
        (error, resp) => (error ? reject(error) : resolve(resp)),
      );
    })
      .then((resp) => (isFunction(handleResp) ? handleResp<T>(resp) : resp))
      .catch((err) => {
        if (err && isFunction(handleError)) {
          handleError(err);
          return;
        }
        logger.error(err);
        throw new CreateAPIError('request error');
      });
  }

  request<T>(endpoint: string, options: CreateAPIOptions<T> = {}) {
    const { handleOptions, handleResp, handleError, ...reqOpts } = {
      ...this.baseOptions,
      ...options,
    };

    let cancel = () => {};

    let opts: AxiosRequestConfig = {
      withCredentials: true,
      // eslint-disable-next-line no-return-assign
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
      ...reqOpts,
    };

    if (isFunction(handleOptions)) opts = handleOptions(opts) || opts;

    const url = this.__formatURL(this.baseURL, endpoint);

    const promise: IRequestResult<T> = axios(url, opts)
      .then(this.__checkStatus)
      .then((resp) => resp.data)
      .then(this.__checkResp)
      .then((resp) => (isFunction(handleResp) ? handleResp<T>(resp) : resp))
      .catch((err) => {
        if (axios.isCancel(err)) {
          logger.warn('request cancel');
          logger.warn(`url: ${url}`);
          logger.warn(`opts: ${JSON.stringify(opts)}`);
          return;
        }

        if (err && isFunction(handleError)) {
          handleError(err);
          return;
        }

        logger.error(err.message || err);
        throw new CreateAPIError('request error');
      }) as any;

    promise.promise = promise;
    promise.cancel = cancel;

    return promise;
  }

  protected __formatURL(baseURL: string, endPoint = '') {
    const urlInfo = url.parse(url.resolve(baseURL, endPoint));
    urlInfo.protocol || (urlInfo.protocol = 'https:');
    return url.format(urlInfo);
  }

  protected __checkStatus(resp: AxiosResponse) {
    if (resp.status >= 200 && resp.status < 300) {
      return resp;
    }

    logger.error('request error');
    logger.error(`resp: ${resp}`);

    throw new CreateAPIError(`response status error`);
  }

  protected __checkResp(data: any) {
    return data;
  }
}
