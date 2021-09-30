const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'),
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
        "drawTaskNum": 38912602, 
        "confirmName": Random.cword(3,10), 
        "contractName": Random.cword(3,10),
        "status|0-5": 0
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '9', 
            "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'),
            "drawTaskNum": 38912602, 
            "confirmName": Random.cword(3,10), 
            "contractName": Random.cword(3,10),
            "status|0-5": 0
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}