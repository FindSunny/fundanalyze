/**
 * 使用公共接口地址：https://www.doctorxiong.club/api/#api-Fund-getFundRank
 * 使用方法：根据文档指定filter的参数
 */

'use strict';

const { getFundRank } = require('./utils/fundTool');
const { SaveRank } = require('./utils/jsonToExcel');

// 获取收益率近一年的前20名个基金
// sort:String (r(日涨幅) z(周涨幅),1y(最近一个月涨幅),jn(今年涨幅),1n(近一年涨幅))
// fundType:String[] 基金gp(股票型),hh(混合型),zq(债券型),zs(指数型)(可以接受多个参数)
let filter = {
    'sort': 'jn',
    'fundType': ["gp", "hh", "zs"],
    'pageSize': 20
};
getFundRank(filter).then(function (rank) {
    SaveRank(rank, filter.pageSize);
});