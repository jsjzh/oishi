"use strict";
// import { CreateAPI, logger } from '@oishi/fund-shared';
// import _CreateAPI, {
//   IRequestConfig,
// } from '@oishi/fund-shared/typings/createAPI';
// import { Logger } from '@oishi/fund-shared/typings/logger';
// export interface OCreateHelper {
//   request: _CreateAPI;
//   logger: Logger;
// }
// export interface ICreateHelper {
//   requestConfig?: {
//     baseURL: string;
//     baseConfig?: IRequestConfig;
//     baseData?: { [k: string]: string };
//   };
// }
// export default function createHelper(
//   options: ICreateHelper = {},
// ): OCreateHelper {
//   const { requestConfig } = options;
//   const request = requestConfig
//     ? new CreateAPI(
//         requestConfig.baseURL,
//         requestConfig.baseConfig,
//         requestConfig.baseData,
//       )
//     : new CreateAPI('');
//   return {
//     request,
//     logger,
//   };
// }
