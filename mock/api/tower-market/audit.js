const Mock = require('mockjs');
const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "auditStatus|0-2": 0,
        "businessId": Random.natural(15),
        "businessNumber": Random.natural(11),
        "createTime": Random.datetime('yyyy年MM月dd日  HH:mm:ss'),
        "createUser": Mock.mock('@cname()'),
        "id": Mock.mock('@id()'),
        "isDeleted": Random.boolean(1, 1, true),
        "startTime": Random.datetime('yyyy年MM月dd日  HH:mm:ss'),
        "tenantId": Random.integer(100),
        "type|0-2": 0,
        "typeName": Random.csentence(3, 5),
        "updateTime": Random.datetime('yyyy年MM月dd日  HH:mm:ss'),
        "updateUser": Mock.mock('@cname()')
    });
}

module.exports = {
    "code": 200,
    "msg": "ea",
    "success": "成功",
    data: {
        current: Random.natural(1, 20),
        records: [
            {
                "auditStatus": 0,
                "businessId": Random.natural(15),
                "businessNumber": Random.natural(11),
                "createTime": Random.datetime('yyyy年MM月dd日  HH:mm:ss'),
                "createUser": Mock.mock('@cname()'),
                "id": Mock.mock('@id()'),
                "isDeleted": Random.boolean(1, 1, true),
                "startTime": Random.datetime('yyyy年MM月dd日  HH:mm:ss'),
                "tenantId": Random.integer(100),
                "type": "SALE_ORDER_AUDIT",
                "typeName": Random.csentence(3, 5),
                "updateTime": Random.datetime('yyyy年MM月dd日  HH:mm:ss'),
                "updateUser": Mock.mock('@cname()')
            }
        ].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589),
        hitCount: Random.boolean(),
        pages: Random.natural(1, 3),
    }
}








