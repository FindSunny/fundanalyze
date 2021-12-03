'use strict';

const XLSX = require('xlsx');
const { getFundInfo } = require('./fundTool');

module.exports = {
    SaveRank: async (rankList, size) => {
        // 申明工作表
        let wb = XLSX.utils.book_new();

        // 写入工作表
        let ws_data = [];
        ws_data.push(['排名', '代码', '基金', '类型', '今年收益(%)', '近一年收益(%)']);
        let no = 1;
        rankList.forEach(fund => {
            ws_data.push([no, fund.code, fund.name, fund.fundType, fund.thisYearGrowth, fund.lastYearGrowth]);
            no++;
        });
        //创建排名工作簿
        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        // 存储排名工作簿
        XLSX.utils.book_append_sheet(wb, ws, 'rank');
        
        // 股票出现次数统计
        let stockAll = [];

        // 循环获取每个基金的详细数据
        for (let i = 0; i < rankList.length; i++) {
            // 获取基金持仓数据
            var fundInfo = await getFundInfo(rankList[i].code);
            
            // format数据
            let fund_data = [];
            fund_data.push(['代码', '股票', '占比(%)', '持有股数(万股)', '持有金额(万元)']);
            for (let stock of fundInfo) {
                fund_data.push(stock);
                stockAll.push({
                    code: stock[0],
                    name: stock[1],
                    stockNum: parseFloat(stock[3].replaceAll(',', '')),
                    stockAmount: parseFloat(stock[4].replaceAll(',', '')),
                    count: 0
                });
            }
            //创建排名工作簿
            let ws_f = XLSX.utils.aoa_to_sheet(fund_data);
            // 存储排名工作簿
            XLSX.utils.book_append_sheet(wb, ws_f, (i + 1) + '.' + rankList[i].name);
        }

        // 统计股票出现的频率及份额
        let collection_data = stockAll.reduce((stockObj, info) => {
            if (info.code in stockObj) {
                stockObj[info.code].stockNum = info.stockNum;
                stockObj[info.code].stockAmount = info.stockAmount;
            } else {
                stockObj[info.code] = info;
            }
            stockObj[info.code].count++;
            return stockObj;
        }, {});
        
        // 排序
        let collection_array = [];
        for (let code in collection_data) {
            collection_array.push(collection_data[code]);
        }
        collection_array.sort((a, b) => {
            return b.count - a.count;
        });
        // 频率写入
        let collection_array_data = [];
        collection_array_data.push(['代码', '股票',  '基金数量', '持有股数(万股)', '持有金额(万元)']);
        collection_array.forEach(item => {
            collection_array_data.push([item.code, item.name, item.count, item.stockNum, item.stockAmount]);
        });
        //创建排名工作簿
        let ws_s = XLSX.utils.aoa_to_sheet(collection_array_data);
        // 存储排名工作簿
        XLSX.utils.book_append_sheet(wb, ws_s, `基金排名前${size}个股频率统计`);

        // 写入文件
        XLSX.writeFile(wb, `./output/近一年基金排名前${size}持仓及个股频率_` + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + '.xlsx');

        console.log('数据统计完毕！');
    },
};
