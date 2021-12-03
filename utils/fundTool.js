;'use strict';
const { default: axios } = require('axios');

module.exports = {
    getFundRank : async (filter) => {
        let rankList = [];
        // 获取基金排名：近一年+前20名
        await axios.post('https://api.doctorxiong.club/v1/fund/rank', filter)
        .then(function (res) {
            
            if (res.data.code !== 200) {
                console.error(`获取Rank失败: code = ${res.data.code}, message = ${res.data.message}`);
                return [];
            }
            // 获取基金排名数据
            rankList = res.data.data.rank;
            console.log(`获取排名成功！`);
        })
        .catch(function (error) {
            console.error(error);
        });

        return rankList;
    },
    getFundInfo: async (code) => {
        let positionInfo = [];
        // 获取基金持仓
        await axios.get('https://api.doctorxiong.club/v1/fund/position', {
                params :{
                    code: code
                }
            })
            .then(function (res) {
                if (res.data.code !== 200) {
                    console.error(`获取Rank失败: code = ${res.data.code}, message = ${res.data.message}`);
                    return [];
                }
                positionInfo = res.data.data.stockList;
                console.log('成功获取基金持仓:' + code);
            })
            .catch(function (error) {
                console.log(error);
            });
        return positionInfo;
    }
};


