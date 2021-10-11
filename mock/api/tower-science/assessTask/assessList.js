const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "expectDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
        "applicantUser": Random.cword(3,10), 
        "assessUser": Random.cword(3,10), 
        "assessUserName": Random.cword(3,10), 
        "bidEndTime": Random.date('yyyy-MM-dd HH:mm'), 
        "customer": Random.cword(3,10),
        "programId": 38912602, 
        "programLeaderId": 97521073, 
        "programLeaderName": Random.cword(3,10), 
        "programName": Random.cword(3,10), 
        "taskCode":  Random.increment(), 
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
        "status": "1"
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 'assesstask111', 
            "expectDeliverTime": Random.date('yyyy-MM-dd HH:mm'), 
            "applicantUser": Random.cword(3,10), 
            "assessUser": Random.cword(3,10), 
            "assessUserName": Random.cword(3,10), 
            "bidEndTime": Random.date('yyyy-MM-dd HH:mm'), 
            "customer": Random.cword(3,10),
            "programId": 38912602, 
            "programLeaderId": 97521073, 
            "programLeaderName": Random.cword(3,10), 
            "programName": Random.cword(3,10), 
            "taskCode":  Random.increment(), 
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm'), 
            "status": "1"
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}