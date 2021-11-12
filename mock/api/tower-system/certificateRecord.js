const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "certificateNumber": Random.increment(),
        "dataPlaceId": Random.increment(),
        "staffId": Random.increment(),
        "certificateDepartment": Random.cword(3,10),
        "certificateIntroduce": Random.cword(3,10),
        "certificateLevel": Random.cword(3,10),
        "certificateName": Random.cword(3,10),
        "certificateStatus|0-3": 0,
        "certificateType": Random.cword(3,10),
        "staffName": Random.cword(3,10),
        "designation": Random.cword(3,10),
        "endDate": Random.date('yyyy-MM-dd'),
        "startDate": Random.date('yyyy-MM-dd'),
        "updateTime": Random.date('yyyy-MM-dd')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "certificateNumber": Random.increment(),
            "dataPlaceId": Random.increment(),
            "staffId": Random.increment(),
            "certificateDepartment": Random.cword(3,10),
            "certificateIntroduce": Random.cword(3,10),
            "certificateLevel": Random.cword(3,10),
            "certificateName": Random.cword(3,10),
            "certificateStatus|0-3": 0,
            "certificateType": Random.cword(3,10),
            "staffName": Random.cword(3,10),
            "designation": Random.cword(3,10),
            "endDate": Random.date('yyyy-MM-dd'),
            "startDate": Random.date('yyyy-MM-dd'),
            "updateTime": Random.date('yyyy-MM-dd')
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}