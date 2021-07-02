const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "code": Random.increment(),
        "name": `${ Random.ctitle(7, 10) }`,
        "level|1-3": 1,
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 10,
            "code": Random.increment(),
            "name": `${ Random.ctitle(7, 10) }`,
            "level|1-3": 1,
            "children":[{
                "id": 101,
                "code": Random.increment(),
                "name": `${ Random.ctitle(7, 10) }`,
                "level|1-3": 1,
            }].concat(records)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}