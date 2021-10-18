const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "createDept": Random.increment(), 
        "createDeptName": Random.cword(3,10), 
        "createTime": Random.date('yyyy-MM-dd HH:mm'), 
        "createUser": Random.increment(), 
        "createUserName": Random.cword(3,10), 
        "description": Random.cword(3,10), 
        "id": Random.increment(), 
        "currentStatus|1-4": 1
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        statusRecordList: [{
            "createDept": Random.increment(), 
            "createDeptName": Random.cword(3,10), 
            "createTime": Random.date('yyyy-MM-dd HH:mm'), 
            "createUser": Random.increment(), 
            "createUserName": Random.cword(3,10), 
            "description": Random.cword(3,10), 
            "id": Random.increment(), 
            "currentStatus|1-4": 1
        }].concat(records),
        description: Random.cword(3,10),
        issueWeldingDetailedVO: {
            // "componentId": Random.cword(3,10), 
            // "electricWeldingMeters": Random.increment(), 
            // "id": Random.increment(), 
            // "mainPartId": Random.cword(3,10), 
            // "segmentName": Random.cword(3,10), 
            // "singleGroupWeight": Random.increment(), 
            // "verificationStatus|1-4": 1, 
            // "weldingGroupId": Random.increment()
        },
        weldingDetailedVO: {
            "componentId": Random.cword(3,10), 
            "electricWeldingMeters": Random.increment(), 
            "id": Random.increment(), 
            "mainPartId": Random.cword(3,10), 
            "segmentName": Random.cword(3,10), 
            "singleGroupWeight": Random.increment(), 
            "verificationStatus|1-4": 1, 
            "weldingGroupId": Random.increment()
        }
    }
}