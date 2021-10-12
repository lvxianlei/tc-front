const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "internalNumber": Random.natural(11),
        "loftingLeaderName": Random.cword(2,6),
        "loftingTask": Random.natural(11),
        "name": Random.cword(5,10),
        "num": Random.natural(11),
        "pattern|1-3": 1,
        "plannedDeliveryTime": Random.date('yyyy-MM-dd'),
        "status|1-6": 1,
        "taskNum": Random.natural(11),
        "updateStatusTime": Random.date('yyyy-MM-dd')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 'loftingPage111',
            "internalNumber": Random.natural(11),
            "loftingLeaderName": Random.cword(2,6),
            "loftingTask": Random.natural(11),
            "name": Random.cword(5,10),
            "num": Random.natural(11),
            "pattern|1-3": 1,
            "plannedDeliveryTime": Random.date('yyyy-MM-dd'),
            "status|1-6": 1,
            "taskNum": Random.natural(11),
            "updateStatusTime": Random.date('yyyy-MM-dd'),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}