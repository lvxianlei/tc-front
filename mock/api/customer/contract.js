const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 0; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "contractNumber":  Random.natural(15),
        "internalNumber":  Random.natural(11),
        "projectName": Random.cword(5,10),
        "saleType": Random.integer(1, 2),
        "winBidType": Random.integer(1, 2),
        "productType": Random.integer(1, 2),
        "voltageGrade": Random.integer(1, 2),
        "customerCompany": Random.cword(5,10),
        "signCustomerName": Random.cword(5,10),
        "deliveryTime": Random.date('yyyy-MM-dd HH:mm')
    });
}


module.exports = {
    msg: "",
    code: 200,
    data: {
        records: records,
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}
