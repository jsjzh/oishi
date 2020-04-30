import request, { CoreOptions, Response } from 'request';
import { isFunction } from 'lodash';

export type CreateAPIOptions = CoreOptions & {
  handleOption?: (options: CreateAPIOptions) => CreateAPIOptions;
  handleResp?: (data: any) => any;
  handleError?: (error: any, response: Response) => any;
};

export default class CreateAPI {
  baseUrl: string;
  baseOptions: CreateAPIOptions;

  constructor(baseUrl: string, baseOptions?: CreateAPIOptions) {
    this.baseUrl = baseUrl;
    this.baseOptions = baseOptions || {};
  }

  getJSON<T = any>(
    endPoint: string,
    qs: Record<keyof any, any>,
    options?: CreateAPIOptions,
  ) {
    return this.__request<T>(endPoint, {
      method: 'get',
      qs,
      ...options,
    });
  }

  postJSON<T = any>(
    endPoint: string,
    body: Record<keyof any, any>,
    options?: CreateAPIOptions,
  ) {
    return this.__request<T>(endPoint, {
      method: 'post',
      body,
      ...options,
    });
  }

  protected __request<T>(endPoint: string, options: CreateAPIOptions) {
    let currentOptions = {
      ...this.baseOptions,
      ...(options || {}),
    };

    if (isFunction(currentOptions.handleOption))
      currentOptions = currentOptions.handleOption(currentOptions);

    return new Promise<T>(resolve => {
      request(
        {
          baseUrl: this.baseUrl,
          uri: endPoint,
          ...currentOptions,
        },
        (error, response, body) => {
          error &&
            isFunction(currentOptions.handleError) &&
            currentOptions.handleError(error, response);

          isFunction(currentOptions.handleResp)
            ? resolve(currentOptions.handleResp(body))
            : resolve(body);
        },
      );
    });
  }
}
