export const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * 接受 promise 请求并调用
 * 提供 handle 处理 promise 的返回结果 resp
 * handle 的返回参数 boolean 将决定是否进行下一次 promise
 * 还有一个参数是代表最大重试次数
 * @param promise promise 函数
 * @param data promise 函数对应的 data
 * @param handleResp promise 函数调用之后返回的结果
 * @param count 要重试的次数
 */
export const retryPromise = async <T = any, D = any>(
  promise: (data: D) => Promise<T>,
  data: D,
  handleResp: (resp: T) => boolean,
  maxRetryCount = 3,
) => {
  for (let i = 0; i < maxRetryCount; i++)
    if (handleResp(await promise(data))) return;
};

export const realType = (
  obj: any,
):
  | 'Number'
  | 'String'
  | 'Boolean'
  | 'Object'
  | 'Null'
  | 'Undefined'
  | 'Array'
  | 'Function'
  | 'Symbol'
  | 'Date'
  | 'BigInt'
  | 'Map'
  | 'Set'
  | 'WeakMap'
  | 'WeakSet'
  | 'Promise'
  | 'AsyncFunction'
  | string => {
  const matched = /^\[object (\w+)\]$/.exec(
    Object.prototype.toString.call(obj),
  );
  return matched ? matched[1] : 'unknown';
};

realType.isNumber = (x: any) => realType(x) === 'Number';
realType.isString = (x: any) => realType(x) === 'String';
realType.isBoolean = (x: any) => realType(x) === 'Boolean';
realType.isObject = (x: any) => realType(x) === 'Object';
realType.isNull = (x: any) => realType(x) === 'Null';
realType.isUndefined = (x: any) => realType(x) === 'Undefined';
realType.isArray = (x: any) => realType(x) === 'Array';
realType.isFunction = (x: any) => realType(x) === 'Function';
realType.isSymbol = (x: any) => realType(x) === 'Symbol';
realType.isDate = (x: any) => realType(x) === 'Date';
realType.isBigInt = (x: any) => realType(x) === 'BigInt';
realType.isMap = (x: any) => realType(x) === 'Map';
realType.isSet = (x: any) => realType(x) === 'Set';
realType.isWeakMap = (x: any) => realType(x) === 'WeakMap';
realType.isWeakSet = (x: any) => realType(x) === 'WeakSet';
realType.isPromise = (x: any) => realType(x) === 'Promise';
realType.isAsyncFunction = (x: any) => realType(x) === 'AsyncFunction';

/**
 * 判断数组中的元素是否都符合一个「异步判断函数」的返回
 * usage
 * cosnt result = await asyncEvery(arr, async (item) => await fn(item))
 */
export const asyncEvery = async <T>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  for (let i = 0; i < arr.length; i++)
    if (!(await callback(arr[i], i, arr))) return false;
  return true;
};

/**
 * 判断数组中是否有一个元素符合「异步判断函数」的返回
 * usage
 * cosnt result = await asyncSome(arr, async (item) => await fn(item))
 */
export const asyncSome = async <T>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  for (let i = 0; i < arr.length; i++)
    if (await callback(arr[i], i, arr)) return true;
  return false;
};

/**
 * 数组执行一个异步循环，每次都会等上一个异步循环处理完毕再执行下一个
 * usage
 * await asyncForEach(arr, async (item) => await fn(item))
 */
export const asyncForEach = async <T>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<void>,
) => {
  for (let i = 0; i < arr.length; i++) await callback(arr[i], i, arr);
};

/**
 * 数组异步 map 方法，callback 方法是 Promise 函数
 * usage
 * const result = await asyncMap(arr, async (item) => await fn(item))
 */
export const asyncMap = async <T, P>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<P>,
) => {
  const result = [];
  for (let i = 0; i < arr.length; i++)
    result.push(await callback(arr[i], i, arr));
  return result;
};

export const asyncFind = async <T>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  for (let i = 0; i < arr.length; i++) {
    if (await callback(arr[i], i, arr)) {
      return arr[i];
    } else {
      if (i === arr.length - 1) {
        // 如果 arr[i] 是最后一个元素
        // 则代表没有找到，直接返回 undefined
        // 与 Array.prototype.find 行为一致
        return undefined;
      } else {
        continue;
      }
    }
  }
};

export const asyncFindIndex = async <T>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  for (let i = 0; i < arr.length; i++) {
    if (await callback(arr[i], i, arr)) {
      return i;
    } else {
      if (i === arr.length - 1) {
        // 如果 arr[i] 是最后一个元素
        // 则代表没有找到，直接返回 undefined
        // 并且与 Array.prototype.findIndex 行为**不**一致
        return undefined;
      } else {
        continue;
      }
    }
  }
};

export const asyncFilter = async <T>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  const result = [];
  for (let i = 0; i < arr.length; i++)
    (await callback(arr[i], i, arr)) && result.push(arr[i]);
  return result;
};

// Array.prototype.reduce
// Array.prototype.reduceRight
// Array.prototype.sort
// Array.prototype.flatMap

export const parseDataURI = (dataURI: string) => {
  const dataURIReg = /^data(\:.*?)(\;.*?)?(\,.*)$/i;

  const [, _mime, _encode, _code] = dataURIReg.exec(dataURI) || [];

  return {
    mime: _mime.slice(1) || null,
    encode: _encode.slice(1) || null,
    code: _code.slice(1) || null,
  };
};
