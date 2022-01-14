const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "approvalTime": Random.date('yyyy-MM-dd'),
        "businessManager": Random.increment(),
        "businessManagerName": Random.cword(5, 10),
        "customerCompany": Random.cword(5, 10),
        "deliveryTime": Random.date('yyyy-MM-dd'),
        "description": Random.cword(5, 10),
        "id": Random.increment(),
        "issueUser": Random.increment(),
        "issueUserName": Random.cword(5, 10),
        "lineName": Random.cword(5, 10),
        "loftCompleteTime": Random.date('yyyy-MM-dd'),
        "loftIssueTime": Random.date('yyyy-MM-dd'),
        "loftRealCompleteTime": Random.date('yyyy-MM-dd'),
        "planDeliveryTime": Random.date('yyyy-MM-dd'),
        "planNumber": Random.cword(5, 10),
        "productCategory": Random.increment(),
        "productCategoryName": Random.cword(3, 6),
        "productNum": Random.increment(),
        "productType": Random.increment(),
        "productTypeName": Random.cword(5, 10),
        "status|1-4": 4,
        "voltageGradeName": Random.cword(5, 10),
        "weight": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 111,
            "approvalTime": Random.date('yyyy-MM-dd'),
            "businessManager": Random.increment(),
            "businessManagerName": Random.cword(5, 10),
            "customerCompany": Random.cword(5, 10),
            "deliveryTime": Random.date('yyyy-MM-dd'),
            "description": Random.cword(5, 10),
            "issueUser": Random.increment(),
            "issueUserName": Random.cword(5, 10),
            "lineName": Random.cword(5, 10),
            "loftCompleteTime": Random.date('yyyy-MM-dd'),
            "loftIssueTime": Random.date('yyyy-MM-dd'),
            "loftRealCompleteTime": Random.date('yyyy-MM-dd'),
            "planDeliveryTime": Random.date('yyyy-MM-dd'),
            "planNumber": Random.cword(5, 10),
            "productCategory": Random.increment(),
            "productCategoryName": "cillum sed",
            "productNum": Random.increment(),
            "productType": Random.increment(),
            "productTypeName": Random.cword(5, 10),
            "status|1-4": 4,
            "voltageGradeName": Random.cword(5, 10),
            "weight": Random.increment()
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}