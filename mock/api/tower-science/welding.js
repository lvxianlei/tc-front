const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "internalNumber": Random.increment(), 
        "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'),
        "priority|1-3": "1", 
        "productType": "Duis esse", 
        "saleOrderNumber": Random.cword(3,10), 
        "status|1-5": "1",
        "taskCode": Random.increment(), 
        "taskNumber": Random.increment(), 
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
        "weldingLeader":  Random.cword(3,10)
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
            "priority|1-3": "1", 
            "productType": "Duis esse", 
            "saleOrderNumber": Random.cword(3,10), 
            "status|1-5": "1",
            "taskCode": Random.increment(), 
            "taskNumber": Random.increment(), 
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
            "weldingLeader":  Random.cword(3,10)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}