const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "productNumber": Random.natural(11),
        "materialDeliverTime": Random.date('yyyy-MM-dd'),
        "materialStatus|1-4": 1,
        "materialUpdateStatusTime": Random.date('yyyy-MM-dd'),
        "materialUserName": Random.cword(5,10),
        "materialUser": Random.natural(11),
        "materialUserName": Random.cword(5,10),
        "materialUser": Random.natural(11),
        "productCategory": Random.natural(11),
        "productCategoryName": Random.cword(5,10),
        "productNumber": Random.natural(11)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '7',
            "productNumber": Random.natural(11),
            "materialDeliverTime": Random.date('yyyy-MM-dd'),
            "materialStatus|1-4": 1,
            "materialUpdateStatusTime": Random.date('yyyy-MM-dd'),
            "materialUserName": Random.cword(5,10),
            "materialUser": Random.natural(11),
            "materialUserName": Random.cword(5,10),
            "materialUser": Random.natural(11),
            "productCategory": Random.natural(11),
            "productCategoryName": Random.cword(5,10),
            "productNumber": Random.natural(11)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}