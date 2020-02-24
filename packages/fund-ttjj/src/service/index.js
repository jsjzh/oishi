"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fund_shared_1 = require("@oishi/fund-shared");
const path_1 = tslib_1.__importDefault(require("path"));
const dataPath = path_1.default.resolve(process.cwd(), './config/secret.json');
const sendData = require(dataPath);
const tradeapilvs5 = new fund_shared_1.CreateAPI('https://tradeapilvs5.1234567.com.cn/', { handleResp: data => data.Data }, { UserId: sendData.UserId });
exports.GetMyAssetDetails = (data = {
    CToken: sendData.CToken,
    MobileKey: sendData.MobileKey,
    ServerVersion: sendData.ServerVersion,
    UToken: sendData.UToken,
}) => tradeapilvs5.postForm('/User/home/GetMyAssetDetails', data);
exports.GetShareDetail = (data = {}) => tradeapilvs5.postForm('/User/home/GetShareDetail', data);
exports.GetTransactionRecords = (data = {}) => tradeapilvs5.postForm('/User/home/GetTransactionRecords', data);
exports.GetProfitList = (data = {}) => tradeapilvs5.postForm('/User/home/GetProfitList', data);
