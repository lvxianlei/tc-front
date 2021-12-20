const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "createTime": Random.date('yyyy-MM-dd HH:mm'),
        "derrickNo":Random.cword(3,10),
        "maintenanceTeamName":Random.cword(3,10),
        "picklingTeamName":Random.cword(3,10),
        "wearHangTeamName":Random.cword(3,10),
        "weighManName":Random.cword(3,10),
        "weighingDate":Random.date('yyyy-MM-dd HH:mm'),
        "weighingNo":Random.cword(3,10),
        "weighingTypeId":Random.increment(),
        "weighingTypeName":Random.cword(3,10),
        "weight":Random.increment(),
        "zincPotTeamName":Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": "123456",
            "createTime": Random.date('yyyy-MM-dd HH:mm'),
            "derrickNo":Random.cword(3,10),
            "maintenanceTeamName":Random.cword(3,10),
            "picklingTeamName":Random.cword(3,10),
            "wearHangTeamName":Random.cword(3,10),
            "weighManName":Random.cword(3,10),
            "weighingDate":Random.date('yyyy-MM-dd HH:mm'),
            "weighingNo":Random.cword(3,10),
            "weighingTypeId":Random.increment(),
            "weighingTypeName":Random.cword(3,10),
            "weight":Random.increment(),
            "zincPotTeamName":Random.cword(3,10)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}