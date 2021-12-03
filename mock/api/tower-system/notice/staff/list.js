const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "content": Random.cword(3,10),
        "title": Random.cword(3,10),
        "releaseTime": Random.date('yyyy-MM-dd')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "content": Random.cword(3,10),
            "title": Random.cword(3,10),
            "releaseTime": Random.date('yyyy-MM-dd')
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}