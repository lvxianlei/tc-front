const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "chargeType": 1,
        "customerCompany": Random.cword(5,10),
        "deliveryTime": Random.date('yyyy-MM-dd'),
        "internalNumber": Random.natural(11),	
        "orderDeliveryTime": Random.date('yyyy-MM-dd'),
        "projectName": Random.cword(5,10),
        "saleOrderNumber": Random.natural(11),
        "signCustomerName": Random.cword(5,10),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 1,
            "chargeType": 1,
            "customerCompany": Random.cword(5,10),
            "deliveryTime": Random.date('yyyy-MM-dd'),
            "internalNumber": Random.natural(11),	
            "orderDeliveryTime": Random.date('yyyy-MM-dd'),
            "projectName": Random.cword(5,10),
            "saleOrderNumber": Random.natural(11),
            "signCustomerName": Random.cword(5,10),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589),
        hitCount: Random.boolean(),
        pages: Random.natural(1, 3),
    }
}