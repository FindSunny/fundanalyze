/**
 * 使用公共接口地址：https://www.doctorxiong.club/api/#api-Fund-getFundRank
 * 使用方法：根据文档指定filter的参数
 */

'use strict';

const { getFundRank } = require("./utils/fundTool");
const { SaveRank } = require("./utils/jsonToExcel");

// 获取收益率近一年的前20名个基金
// (r(日涨幅) z(周涨幅),1y(最近一个月涨幅),jn(今年涨幅),1n(近一年涨幅))
let filter = {
    'sort': 'jn',
    'pageSize': 20
};
getFundRank(filter).then(function (rank) {
    SaveRank(rank, filter.pageSize);
});
