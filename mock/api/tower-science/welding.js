const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "internalNumber": Random.increment(), 
        "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'),
        "priority|1-3": 1, 
        "productType": Random.cword(3,10), 
        "saleOrderNumber": Random.increment(), 
        "status|1-5": 1,
        "taskCode": Random.increment(), 
        "taskNumber": Random.increment(), 
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
        "weldingLeader":  Random.cword(3,10),
        "productCategoryId":  Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 111, 
            "internalNumber": Random.increment(), 
            "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'),
            "priority|1-3": 1, 
            "productType": Random.cword(3,10),  
            "saleOrderNumber": Random.increment(), 
            "status|1-5": 1,
            "taskCode": Random.increment(), 
            "taskNumber": Random.increment(), 
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
            "weldingLeader":  Random.cword(3,10),
            "productCategoryId":  Random.increment()
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}