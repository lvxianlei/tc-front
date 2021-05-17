const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "tenantId": Random.increment(),
        "name": `${ Random.ctitle(7, 10) }有限公司`,
        "type|1-2": 1,
        "linkman": Random.cname(),
        "phone": Random.natural(11),
        "description": Random.csentence(10),
        "createTime": Random.date('yyyy-MM-dd HH:mm')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 81,
            "tenantId": Random.increment(),
            "name": `${ Random.ctitle(7, 10) }有限公司`,
            "type|1-2": 1,
            "linkman": Random.cname(),
            "phone": Random.natural(11),
            "description": Random.csentence(10),
            "createTime": Random.date('yyyy-MM-dd HH:mm')
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}