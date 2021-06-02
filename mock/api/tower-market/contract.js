const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "contractNumber":  Random.natural(15),
        "internalNumber":  Random.natural(11),
        "projectName": Random.cword(5,10),
        "saleType|1-2": 1,
        "winBidType|1-2": 1,
        "productType|1-2": 1,
        "voltageGrade|1-2": 1,
        "customerCompany": Random.cword(5,10),
        "signCustomerName": Random.cword(5,10),
        "deliveryTime": Random.date('yyyy-MM-dd'),
        "signCustomerId": Random.natural(2),
        "status|0-1":1
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 2,
            "contractNumber":  Random.natural(15),
            "internalNumber":  Random.natural(11),
            "projectName": Random.cword(5,10),
            "saleType|1-2": 1,
            "winBidType|1-2": 1,
            "productType|1-2": 1,
            "voltageGrade|1-2": 1,
            "customerCompany": Random.cword(5,10),
            "signCustomerName": Random.cword(5,10),
            "deliveryTime": Random.date('yyyy-MM-dd'),
            "signCustomerId": Random.natural(2),
            "status": 1
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}