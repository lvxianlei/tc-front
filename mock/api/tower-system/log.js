const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "deptName": Random.cword(3,10),
        "optName": Random.cword(3,10),
        "optTime": Random.date('yyyy-MM-dd'),
        "serviceId": Random.increment(),
        "deptId": Random.increment(),
        "description": Random.cword(3,10),
        "optUserName": Random.cword(3,10),
        "optUserId": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "deptName": Random.cword(3,10),
            "optName": Random.cword(3,10),
            "optTime": Random.date('yyyy-MM-dd'),
            "serviceId": Random.increment(),
            "deptId": Random.increment(),
            "description": Random.cword(3,10),
            "optUserName": Random.cword(3,10),
            "optUserId": Random.increment()
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}