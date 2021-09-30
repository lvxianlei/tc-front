const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "batchSn":  Random.natural(15),
        "embossedStamp":  Random.natural(11),
        "materialStandardName": Random.cword(5,10),
        "projectName": Random.cword(5,10),
        "description": Random.cword(5,10),
        "createUser": Random.cword(5,10),
        "externalTaskNum": Random.natural(11),
        "productShape": Random.cword(5,10),
        "createTime": Random.date('yyyy-MM-dd'),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 6,
            "batchSn":  Random.natural(15),
            "embossedStamp":  Random.natural(11),
            "materialStandardName": Random.cword(5,10),
            "projectName": Random.cword(5,10),
            "description": Random.cword(5,10),
            "createUser": Random.cword(5,10),
            "externalTaskNum": Random.natural(11),
            "productShape": Random.cword(5,10),
            "createTime": Random.date('yyyy-MM-dd'),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}