const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "saleOrderNumber":  Random.natural(15),
        "internalNumber":  Random.natural(11),
        "taskNumber": Random.natural(11),
        "materialStandard":  Random.ctitle(7, 10),
        "materialStandardName":  Random.ctitle(7, 10),
        "materialDemand":  Random.ctitle(7, 10),
        "projectName": Random.cword(5,10),
        "taskReviewStatus": 1,
        "planDeliveryTime": Random.date('yyyy-MM-dd'),
        "deliveryTime": Random.date('yyyy-MM-dd')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 1,
            "saleOrderNumber":  Random.natural(15),
            "internalNumber":  Random.natural(11),
            "taskNumber": Random.natural(11),
            "materialStandard": Random.ctitle(7, 10),
            "materialStandardName":  Random.ctitle(7, 10),
            "materialDemand":  Random.ctitle(7, 10),
            "projectName": Random.cword(5,10),
            "taskReviewStatus": 1,
            "planDeliveryTime": Random.date('yyyy-MM-dd'),
            "deliveryTime": Random.date('yyyy-MM-dd')
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589),
        hitCount: Random.boolean(),
        pages: Random.natural(1, 3),
    }
}