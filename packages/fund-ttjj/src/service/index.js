"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fund_shared_1 = require("@oishi/fund-shared");
const secret_json_1 = require("./secret.json");
const tradeapilvs5 = new fund_shared_1.CreateAPI('https://tradeapilvs5.1234567.com.cn/', {
    handleResp: data => data.Data,
}, secret_json_1.userToken);
exports.GetMyAssetDetails = tradeapilvs5.postForm('/User/home/GetMyAssetDetails');
