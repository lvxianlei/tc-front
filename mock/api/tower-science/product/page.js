const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "loftingDeliverTime": Random.date('yyyy-MM-dd'),
        "loftingLeaderName": Random.cword(5,10),
        "loftingStatus|1-5": 1,
        "loftingUserName": Random.cword(5,10),
        "materialDeliverTime": Random.date('yyyy-MM-dd'),
        "materialLeaderName": Random.cword(5,10),
        "materialStatus|1-3": 1,
        "materialUserName": Random.cword(5,10),
        "productCategoryId": Random.natural(11),
        "productCategoryName":  Random.cword(5,10),
        "productNumber": Random.natural(11)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": Random.increment(),
            "loftingDeliverTime": Random.date('yyyy-MM-dd'),
            "loftingLeaderName": Random.cword(5,10),
            "loftingStatus|1-5": 1,
            "loftingUserName": Random.cword(5,10),
            "materialDeliverTime": Random.date('yyyy-MM-dd'),
            "materialLeaderName": Random.cword(5,10),
            "materialStatus|1-3": 1,
            "materialUserName": Random.cword(5,10),
            "productCategoryId": Random.natural(11),
            "productCategoryName":  Random.cword(5,10),
            "productNumber": Random.natural(11)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}