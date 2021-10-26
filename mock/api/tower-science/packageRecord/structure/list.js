const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "packageRecordId": Random.increment(),
        "towerStructureId": Random.increment(),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        "balesCode":Random.increment(),
        "productCategoryName": Random.cword(5,10),
        "productCategoryId":Random.increment(),
        "productId":Random.increment(),
        "productNumber": Random.increment(),
        // "packageStructureVOList": [{
        //     "packageRecordId": Random.increment(),
        //     "towerStructureId": Random.increment()
        // }].concat(records)
    }
}