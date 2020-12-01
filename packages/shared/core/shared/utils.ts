export const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time * 1000));

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

/**
 * 判断数组中的元素是否都符合一个「异步判断函数」的返回
 * usage
 * cosnt result = await asyncEvery(arr, async (item) => await fn(item))
 */
export const asyncEvery = async <T>(
  arr: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  for (let i = 0; i < arr.length; i++)
    if (!(await callbackfn(arr[i], i, arr))) return false;
  return true;
};

/**
 * 判断数组中是否有一个元素符合「异步判断函数」的返回
 * usage
 * cosnt result = await asyncSome(arr, async (item) => await fn(item))
 */
export const asyncSome = async <T>(
  arr: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>,
) => {
  for (let i = 0; i < arr.length; i++)
    if (await callbackfn(arr[i], i, arr)) return true;
  return false;
};

// Array.prototype.find
// Array.prototype.findIndex
// Array.prototype.forEach
// Array.prototype.reduce
// Array.prototype.reduceRight
// Array.prototype.sort
// Array.prototype.filter
// Array.prototype.map
// Array.prototype.flatMap
