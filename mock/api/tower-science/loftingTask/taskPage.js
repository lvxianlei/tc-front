const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
        "internalNumber": Random.cword(3,10), 
        "productCategoryEndNum": Random.increment(),
        "productCategoryNum": Random.increment(),
        "productEndNum": Random.increment(),
        "productNum": Random.increment(),
        "saleOrderNumber": Random.increment(),
        "taskCode": Random.increment(),
        "taskNumber": Random.increment(),
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'),
        "weight":  Random.increment(),
        "status|1-5": 1
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 'taskPage111', 
            "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
            "internalNumber": Random.cword(3,10), 
            "productCategoryEndNum": Random.increment(),
            "productCategoryNum": Random.increment(),
            "productEndNum": Random.increment(),
            "productNum": Random.increment(),
            "saleOrderNumber": Random.increment(),
            "taskCode": Random.increment(),
            "taskNumber": Random.increment(),
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'),
            "weight":  Random.increment(),
            "status|1-5": 1
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}