const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 5; ++i) {
    records.push({
        "id": Random.natural(1),
        "type": `${ Random.ctitle(1, 3) }`,
        "name": `${ Random.ctitle(1, 3) }`,
        "disable": true,
        "sort": Random.natural(5),
        "amount": Random.natural(5),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        id:Random.natural(1),
        name:`${ Random.ctitle(1,3) }`,
        sort: Random.natural(5),
        records: [{
            "id": Random.natural(1),
            "type": `${ Random.ctitle(1, 3) }`,
            "name": `${ Random.ctitle(1, 3) }`,
            "disable": true,
            "sort": Random.natural(5),
            "amount": Random.natural(5),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }


}