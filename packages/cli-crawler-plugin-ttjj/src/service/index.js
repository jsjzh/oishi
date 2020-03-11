"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oishi_shared_1 = require("@oishi/oishi-shared");
exports.createService = (baseUrl, config, baseData) => {
    const service = new oishi_shared_1.CreateAPI(baseUrl, config, baseData);
    return {
        GetMyAssetDetails: (data) => service.postForm('/User/home/GetMyAssetDetails', data),
        GetShareDetail: (data) => service.postForm('/User/home/GetShareDetail', data),
        GetTransactionRecords: (data) => service.postForm('/User/home/GetTransactionRecords', data),
        GetProfitList: (data) => service.postForm('/User/home/GetProfitList', data),
    };
};
