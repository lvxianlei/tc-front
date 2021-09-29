const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
        "weight":Random.increment(),
        "taskNumber": 38912602, 
        "saleOrderNumber": 97521073, 
        "programLeaderName": Random.cword(3,10), 
        "taskCode": Random.increment(), 
        "internalNumber":  Random.increment(), 
        "productCategoryEndNum": Random.increment(),
        "productCategoryNum": Random.increment(),
        "productEndNum": Random.increment(),
        "productNum": Random.increment(),
        "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
        "status|1-5": 1
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '9', 
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
            "weight":Random.increment(),
            "taskNumber": 38912602, 
            "saleOrderNumber": 97521073, 
            "programLeaderName": Random.cword(3,10), 
            "taskCode": Random.increment(), 
            "internalNumber":  Random.increment(), 
            "productCategoryEndNum": Random.increment(),
            "productCategoryNum": Random.increment(),
            "productEndNum": Random.increment(),
            "productNum": Random.increment(),
            "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
            "status|1-5": 1
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}