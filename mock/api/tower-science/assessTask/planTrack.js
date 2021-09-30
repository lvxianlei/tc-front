const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "loftingDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
        "loftingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "businessUserName": Random.cword(3,10),
        "taskNumber": 38912602, 
        "taskCode": 97521073, 
        "taskCode": Random.increment(),  
        "productCategoryName": Random.cword(3,10), 
        "num":  Random.increment(), 
        "materialDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "materialDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'),
        "loftingStatus|1-6": 1,
        "materialStatus|1-6": 1,
        "priority|1-3": 1
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": Random.increment(), 
            "loftingDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "businessUserName": Random.cword(3,10),
            "taskNumber": 38912602, 
            "taskCode": 97521073, 
            "taskCode": Random.increment(),  
            "productCategoryName": Random.cword(3,10), 
            "num":  Random.increment(), 
            "materialDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "materialDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'),
            "loftingStatus|1-6": 1,
            "materialStatus|1-6": 1,
            "priority|1-3": 1
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}