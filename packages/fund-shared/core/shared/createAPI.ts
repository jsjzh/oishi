import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import urlUtil from 'url';
import qs from 'query-string';
import jsonp from 'jsonp';
import ExtendableError from 'es6-error';

class APIError extends ExtendableError {
  constructor(message = '') {
    super(message);
  }
}

axios.defaults.withCredentials = true;

type IRequestConfig = AxiosRequestConfig & {
  handleOption?: (option: AxiosRequestConfig) => any;
  handleResp?: (data: any) => any;
};

type IRequestResult<T> = Promise<T> & {
  promise: Promise<T>;
  cancel: () => void;
};

class CreateAPI {
  host: string;
  baseConfig: IRequestConfig;
  baseData: { [k: string]: string };
  instance: AxiosInstance;

  constructor(
    baseURL: string,
    baseConfig: IRequestConfig = {},
    baseData: { [k: string]: string } = {},
  ) {
    this.host = baseURL;
    this.baseConfig = baseConfig;
    this.baseData = baseData;
    this.instance = axios.create({ baseURL });
  }

  checkStatus(resp: AxiosResponse) {
    if (resp.status >= 200 && resp.status < 300) return resp;
    throw new APIError(`[${resp.status}] 请求错误 ${resp.config.url}`);
  }

  chekcResp(data: any) {
    return data;
    // if (data.success) return data;
    // throw new APIError(`[${data.code}] 请求失败 ${data.msg}`);
  }

  request<T = any>(
    endPoint: string,
    reqConfig: IRequestConfig = {},
  ): IRequestResult<T> {
    const config = { ...this.baseConfig, reqConfig };

    const {
      handleOption,
      handleResp = (resp: any) => resp,
      ...reqOpts
    } = config;

    const opts =
      typeof handleOption === 'function' ? handleOption(reqOpts) : reqConfig;

    const promise = this.instance(endPoint, opts)
      .then(this.checkStatus)
      .then(resp => resp.data)
      .then(this.chekcResp)
      .then(handleResp) as IRequestResult<T>;

    return promise;
  }

  getJSON<T>(
    endPoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endPoint, {
      ...config,
      method: 'get',
      params: { ...data, ...this.baseData },
    });
  }

  postJSON<T = any>(
    endPoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endPoint, {
      ...config,
      method: 'post',
      data: { ...data, ...this.baseData },
    });
  }

  postForm<T = any>(
    endPoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endPoint, {
      ...config,
      method: 'post',
      data: qs.stringify({ ...data, ...this.baseData }),
    });
  }

  putJSON<T = any>(
    endPoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endPoint, {
      ...config,
      method: 'put',
      data: { ...data, ...this.baseData },
    });
  }

  patchJSON<T = any>(
    endPoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endPoint, {
      ...config,
      method: 'patch',
      data: { ...data, ...this.baseData },
    });
  }

  deleteJSON<T = any>(
    endPoint: string,
    data: { [k: string]: string } = {},
    config?: IRequestConfig,
  ) {
    return this.request<T>(endPoint, {
      ...config,
      method: 'delete',
      data: { ...data, ...this.baseData },
    });
  }

  jsonp<T = any>(
    endPoint: string,
    config: Pick<IRequestConfig, 'handleResp'> = {},
  ): Promise<T> {
    const { handleResp = (resp: any) => resp.data } = config;
    return new Promise((resolve, reject) => {
      const url = urlUtil.resolve(this.host, endPoint);

      jsonp(
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
}

export default CreateAPI;
