const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "createUser": Random.increment(),
        "createTime":"2021-04-19 14:50:22",
        "updateUser": Random.increment(),
        "updateTime":"2021-05-26 11:52:14",
        "status|1-0":1,
        "isDeleted":0,
        "tenantId": Random.increment(),
        "clientId": Random.increment(),
        "name": Random.cword(3,10),
        "parentId":"2",
        "sort|1-100":1,
        "description": Random.cword(5,10),
        "hasChildren": Random.boolean(),
        "parentName": Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id":"789456",
            "createUser":"1",
            "createTime":"2021-04-19 14:50:22",
            "updateUser":"1",
            "updateTime":"2021-05-26 11:52:14",
            "status":1,
            "isDeleted":0,
            "tenantId":"000000",
            "clientId":"sword",
            "name":"TC开发部",
            "parentId":"2",
            "sort":1,
            "description":"15648446515465451545",
            "hasChildren":false,
            "parentName": "",
            "children": [{
                "id": Random.increment(),
                "createUser": Random.increment(),
                "createTime":"2021-04-19 14:50:22",
                "updateUser": Random.increment(),
                "updateTime":"2021-05-26 11:52:14",
                "status|1-0":1,
                "isDeleted":0,
                "tenantId": Random.increment(),
                "clientId": Random.increment(),
                "name": Random.cword(3,10),
                "parentId":"2",
                "sort|1-100":1,
                "description": Random.cword(5,10),
                "hasChildren": Random.boolean(),
                "parentName": Random.cword(3,10)
            }, {
                "id": Random.increment(),
                "createUser": Random.increment(),
                "createTime":"2021-04-19 14:50:22",
                "updateUser": Random.increment(),
                "updateTime":"2021-05-26 11:52:14",
                "status|1-0":1,
                "isDeleted":0,
                "tenantId": Random.increment(),
                "clientId": Random.increment(),
                "name": Random.cword(3,10),
                "parentId":"2",
                "sort|1-100":1,
                "description": Random.cword(5,10),
                "hasChildren": Random.boolean(),
                "parentName": Random.cword(3,10)
            }]
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}