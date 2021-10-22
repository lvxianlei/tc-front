const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "parentId": Random.increment(),
        "hasChildren": Random.boolean(),
        "title": Random.cword(3,10),
        "key":Random.increment(),
        "value":Random.increment(),
        "children": [{
            "id": Random.increment(),
            "parentId": Random.increment(),
            "hasChildren": Random.boolean(),
            "title":Random.cword(3,5),
            "key":Random.increment(),
            "value":Random.increment()
        }]
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "id": "100000",
        "parentId": Random.increment(),
        "hasChildren": Random.boolean(),
        "title": Random.cword(3,10),
        "key":Random.increment(),
        "value":Random.increment(),
        "children": [{
            "id": "101111",
            "parentId": Random.increment(),
            "hasChildren": Random.boolean(),
            "title": Random.cword(3,5),
            "key":Random.increment(),
            "value":Random.increment()
        }, {
            "id": "789456",
            "parentId": Random.increment(),
            "hasChildren": Random.boolean(),
            "title": Random.cword(3,5),
            "key":Random.increment(),
            "value":Random.increment()
        }]
    }].concat(records)
}