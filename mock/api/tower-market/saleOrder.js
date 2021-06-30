const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "saleOrderNumber":  Random.natural(15),
        "internalNumber":  Random.natural(11),
        "projectName": Random.cword(5,10),
        "chargeType|1-2": 1,
        "customerCompany": Random.cword(5,10),
        "signCustomerName": Random.cword(5,10),
        "deliveryTime": Random.date('yyyy-MM-dd'),
        "orderDeliveryTime": Random.date('yyyy-MM-dd'),
        "contractId": Random.increment(),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 5,
            "saleOrderNumber":  Random.natural(15),
            "internalNumber":  Random.natural(11),
            "projectName": Random.cword(5,10),
            "chargeType|1-2": 1,
            "customerCompany": Random.cword(5,10),
            "signCustomerName": Random.cword(5,10),
            "deliveryTime": Random.date('yyyy-MM-dd'),
            "orderDeliveryTime": Random.date('yyyy-MM-dd'),
            "contractId": 2
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}