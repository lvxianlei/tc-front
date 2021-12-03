const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "isDeleted":-8469385.124256328,
        "terminalTypeName":Random.cword(3,10),
        "terminalType|1-2":1,
        "userName":Random.cword(3,10),
        "terminalVersion":Random.cword(3,10),
        "operatingSystem":Random.cword(3,10),
        "deviceName":Random.cword(3,10),
        "mac":Random.cword(3,10),
        "ip":Random.cword(3,10),
        "address":Random.cword(3,10),
        "tenantId":Random.increment(),
        "loginTime":Random.date('yyyy-MM-dd'),
        "clientId":Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "isDeleted":-8469385.124256328,
            "terminalTypeName":Random.cword(3,10),
            "terminalType|1-2":1,
            "userName":Random.cword(3,10),
            "terminalVersion":Random.cword(3,10),
            "operatingSystem":Random.cword(3,10),
            "deviceName":Random.cword(3,10),
            "mac":Random.cword(3,10),
            "ip":Random.cword(3,10),
            "address":Random.cword(3,10),
            "tenantId":Random.increment(),
            "loginTime":Random.date('yyyy-MM-dd'),
            "clientId":Random.increment()
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}