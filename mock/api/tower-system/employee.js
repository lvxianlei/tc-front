const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "accountId": Random.increment(),
        "autoAccount": Random.increment(),
        "category": Random.increment(),
        "dept": Random.increment(),
        "email": Random.increment(),
        "number": Random.increment(),
        "phone": Random.increment(),
        "roleId": Random.cword(3,10),
        "description": Random.cword(3,10),
        "name": Random.cword(3,10),
        "station": Random.cword(3,10),
        "entryDate": Random.date('yyyy-MM-dd')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "accountId": Random.increment(),
            "autoAccount": Random.increment(),
            "category": Random.increment(),
            "dept": Random.increment(),
            "email": Random.increment(),
            "number": Random.increment(),
            "phone": Random.increment(),
            "roleId": Random.cword(3,10),
            "description": Random.cword(3,10),
            "name": Random.cword(3,10),
            "station": Random.cword(3,10),
            "entryDate": Random.date('yyyy-MM-dd')
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}