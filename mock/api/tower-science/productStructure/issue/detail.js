const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "description": Random.cword(3,10),
        "id": Random.increment(),
        "status|1-4": 1,
        "updateDepartment": Random.increment(),
        "updateDepartmentName": Random.cword(3,10),
        "updateTime": Random.date('yyyy-MM-dd HH:mm'),
        "updateUser": Random.cword(3,10),
        "updateUserName": Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        "currentValue": Random.cword(3,10), 
        "description": Random.cword(3,10), 
        "dataType|1": 1,
        "id": Random.increment(),
        "issueRecordList":[{
                "description": "culpa sunt in",
                "id": 86321377,
                "status": 2,
                "updateDepartment": 89699850,
                "updateDepartmentName": "dolore",
                "updateTime": "2021-01-25",
                "updateUser": 70076727,
                "updateUserName": "voluptate in"
            }].concat(records),
        "keyId": Random.increment(),
        "newValue": Random.cword(3,10), 
        "problemField": Random.increment(),
        "problemFieldName": Random.cword(3,10)
    }
}