const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "retaParam": Random.increment(),
        "reteName": Random.cword(3,10),
        "description": Random.cword(3,10),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "retaParam": Random.increment(),
            "reteName": Random.cword(3,10),
            "description": Random.cword(3,10),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}