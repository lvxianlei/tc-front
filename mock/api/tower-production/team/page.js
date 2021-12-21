const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "createUser": Random.increment(),
        "createTime": Random.date('yyyy-MM-dd HH:mm'),
        "createUserName":Random.cword(3,10),
        "deptProcessesId": Random.increment(),
        "deptProcessesName":Random.cword(3,10),
        "name":Random.cword(3,10),
        "productionLinesId": Random.increment(),
        "productionLinesName":Random.cword(3,10),
        "workshopDeptId": Random.increment(),
        "workshopDeptName":Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": Random.increment(), 
            "createUser": Random.increment(),
            "createTime": Random.date('yyyy-MM-dd HH:mm'),
            "createUserName":Random.cword(3,10),
            "deptProcessesId": Random.increment(),
            "deptProcessesName":Random.cword(3,10),
            "name":Random.cword(3,10),
            "productionLinesId": Random.increment(),
            "productionLinesName":Random.cword(3,10),
            "workshopDeptId": Random.increment(),
            "workshopDeptName":Random.cword(3,10)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}