const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "taskNumber":  Random.natural(15),
        "internalNumber":  Random.natural(11),
        "projectName": Random.cword(5,10),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 5,
            "taskNumber":  Random.natural(15),
            "internalNumber":  Random.natural(11),
            "projectName": Random.cword(5,10),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}