const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "internalNumber": Random.increment(), 
        "name": Random.cword(3,10),
        "pattern|1-3": 1,
        "saleOrderNumber": Random.increment(), 
        "steelAngleCount": Random.increment(), 
        "steelPlateCount": Random.increment(), 
        "steelProductShape": Random.cword(3,10),
        "structureCount": Random.increment(), 
        "taskCode": Random.increment(),
        "updateTime": Random.date('yyyy-MM-dd HH:mm'), 
        "updateUser": Random.increment(), 
        "updateUserName": Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '12121', 
            "internalNumber": Random.increment(), 
            "name": Random.cword(3,10),
            "pattern|1-3": 1,
            "saleOrderNumber": Random.increment(), 
            "steelAngleCount": Random.increment(), 
            "steelPlateCount": Random.increment(), 
            "steelProductShape": Random.cword(3,10),
            "structureCount": Random.increment(), 
            "taskCode": Random.increment(), 
            "updateTime": Random.date('yyyy-MM-dd HH:mm'), 
            "updateUser": Random.increment(), 
            "updateUserName": Random.cword(3,10)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}