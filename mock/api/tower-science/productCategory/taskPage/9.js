const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "boltDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "boltLeaderName": Random.cword(3,10),
        "combinedWeldingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "combinedWeldingLeaderName": Random.cword(3,10),
        "loftingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "loftingLeaderName": Random.cword(3,10),
        "loftingPartDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "loftingPartLeaderName": Random.cword(3,10),
        "materialDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "materialLeaderName": Random.cword(3,10),
        "materialPartDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "materialPartLeaderName": Random.cword(3,10),
        "smallSampleDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "smallSampleLeaderName": Random.cword(3,10),
        "weight":Random.increment(),
        "pattern|1-3": 1,
        "name": Random.cword(3,10),
        "priority|1-3": 1,
        "description": Random.cword(3,10), 
        "steelProductShape": Random.cword(3,10), 
        "status|1-5": 1
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '2', 
            "boltDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "boltLeaderName": Random.cword(3,10),
            "combinedWeldingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "combinedWeldingLeaderName": Random.cword(3,10),
            "loftingDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingLeaderName": Random.cword(3,10),
            "loftingPartDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "loftingPartLeaderName": Random.cword(3,10),
            "materialDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "materialLeaderName": Random.cword(3,10),
            "materialPartDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "materialPartLeaderName": Random.cword(3,10),
            "smallSampleDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "smallSampleLeaderName": Random.cword(3,10),
            "weight":Random.increment(),
            "pattern|1-3": 1,
            "name": Random.cword(3,10),
            "priority|1-3": 1,
            "description": Random.cword(3,10), 
            "steelProductShape": Random.cword(3,10), 
            "status|1-5": 1
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}