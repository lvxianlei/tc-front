const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "code": Random.increment(),
        "name": `${ Random.ctitle(7, 10) }`,
        "level|1-2": 1,
        "ruleFront": Random.ctitle(7, 10),
        "unit": Random.ctitle(1,3)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "id": 10,
        "code": Random.increment(),
        "name": Random.ctitle(7, 10),
        "level": 1,
        "ruleFront": Random.ctitle(7, 10),
        "unit": Random.ctitle(1,3),
        "children":[{
            "id": 101,
            "code": Random.increment(),
            "name": Random.ctitle(7, 10),
            "level|1-2": 1,
            "ruleFront": Random.ctitle(7, 10),
            "unit": Random.ctitle(1,3)
        }].concat(records)
    }].concat(records),
    current: Random.natural(1, 20),
    size: 10,
    total: Random.natural(1, 589)
}