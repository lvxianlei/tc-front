const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "dataPlaceName": Random.cword(3,10),
        "parentId":"2",
        "hasChildren": Random.boolean()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id":"789456",
            "dataPlaceName": Random.cword(3,10),
            "parentId":"2",
            "hasChildren": Random.boolean(),
            "children": [{
                "id": Random.increment(),
                "dataPlaceName": Random.cword(3,10),
                "parentId":"2",
                "hasChildren": Random.boolean()
            }, {
                "id": Random.increment(),
                "dataPlaceName": Random.cword(3,10),
                "parentId":"2",
                "hasChildren": Random.boolean()
            }]
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}