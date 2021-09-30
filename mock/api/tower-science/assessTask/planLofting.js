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
            "boltDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "boltDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "boltLeader": Random.cword(3,10),
            "weldingDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "weldingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "weldingLeader": Random.cword(3,10),
            "loftingDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingLeader": Random.cword(3,10),
            "loftingPartDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingPartDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingPartLeader": Random.cword(3,10),
            "materialDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "materialDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "materialPartDeliverRealTime": Random.cword(3,10),
            "materialPartDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "materialPartLeader": Random.date('yyyy-MM-dd HH:mm'), 
            "materialUser": Random.cword(3,10),
            "smallSampleDeliverRealTime": Random.date('yyyy-MM-dd HH:mm'), 
            "smallSampleDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "smallSampleLeader": Random.cword(3,10),
            "internalNumber": Random.increment(), 
            "totalWeight": 38912602, 
            "weight": 38912602,
            "taskNumber": 38912602, 
            "taskCode": Random.increment(),  
            "saleOrderNumber": Random.increment(), 
            "productCategoryName": Random.cword(3,10), 
            "num":  Random.increment(), 
            "loftingStatus|1-6": 1,
            "materialStatus|1-6": 1,
            "pattern|1-5": 1,
            "priority|1-3": 1
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}