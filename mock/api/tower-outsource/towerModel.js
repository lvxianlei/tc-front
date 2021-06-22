const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "towerName":  Random.natural(15),
        "projectNum":  Random.natural(11),
        "projectName": Random.cword(5,10),
        "examineNum": Random.cword(5,10),
        "examineName": Random.cword(5,10),
        "passedTime": Random.date('yyyy-MM-dd'),
        "deliverTime": Random.date('yyyy-MM-dd'),
        "attachVos": [
            {
                "id": 1,
                "name": "string",
                "time": Random.date('yyyy-MM-dd'),
                "link": Random.cword(5,10),
            },
            {
                "id": 2,
                "name": "上传",
                "link": Random.cword(5,10),
                "time": Random.date('yyyy-MM-dd'),
            },
            {
                "id": 4,
                "name": "上传",
                "link": Random.cword(5,10),
                "time": Random.date('yyyy-MM-dd'),
            }
        ],
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": "1001",
            "towerName":  Random.natural(15),
            "projectNum":  Random.natural(11),
            "projectName": Random.cword(5,10),
            "examineNum": Random.cword(5,10),
            "examineName": Random.cword(5,10),
            "passedTime": Random.date('yyyy-MM-dd'),
            "deliverTime": Random.date('yyyy-MM-dd'),
            "attachVos": [
                {
                    "id": 1,
                    "name": "string",
                    "time": Random.date('yyyy-MM-dd'),
                    "link": Random.cword(5,10),
                },
                {
                    "id": 2,
                    "name": "上传",
                    "link": Random.cword(5,10),
                    "time": Random.date('yyyy-MM-dd'),
                },
                {
                    "id": 4,
                    "name": "上传",
                    "link": Random.cword(5,10),
                    "time": Random.date('yyyy-MM-dd'),
                }
            ]
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}