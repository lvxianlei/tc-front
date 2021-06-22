const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "checkNum": Random.increment(),
        "conductNum": Random.increment(),
        "finishNum": Random.increment(),
        "projectNum": Random.natural(11),
        "projectName":`${ Random.ctitle(7, 10) }`,
        "projectEndTime": Random.date('yyyy-MM-dd HH:mm'),
        "projectStartTime": Random.date('yyyy-MM-dd HH:mm'),
        "status|1-5": 1,
        "towerModelVoList": [{
            "deliverTime": Random.date('yyyy-MM-dd HH:mm'),
            "examineName": Random.increment(),
            "examineNum": Random.increment(),
            "examineSectionNum": Random.increment(),
            "examineUser": `${ Random.ctitle(7, 10) }`,
            "id": Random.increment(),
            "passedTime": Random.date('yyyy-MM-dd HH:mm'),
            "projectName": `${ Random.ctitle(7, 10) }`,
            "projectNum": Random.increment(),
            "sectionNum": Random.increment(),
            "towerName": `${ Random.ctitle(7, 10) }`,
        }]
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 1001,
            "checkNum": Random.increment(),
            "conductNum": Random.increment(),
            "finishNum": Random.increment(),
            "projectNum": Random.natural(11),
            "projectName":`${ Random.ctitle(7, 10) }`,
            "projectEndTime": Random.date('yyyy-MM-dd HH:mm'),
            "projectStartTime": Random.date('yyyy-MM-dd HH:mm'),
            "status|1-5": 1,
            "towerModelVoList": [{
                "deliverTime": Random.date('yyyy-MM-dd HH:mm'),
                "examineName": Random.increment(),
                "examineNum": Random.increment(),
                "examineSectionNum": Random.increment(),
                "examineUser": `${ Random.ctitle(7, 10) }`,
                "id": Random.increment(),
                "passedTime": Random.date('yyyy-MM-dd HH:mm'),
                "projectName": `${ Random.ctitle(7, 10) }`,
                "projectNum": Random.increment(),
                "sectionNum": Random.increment(),
                "towerName": `${ Random.ctitle(7, 10) }`,
            }]
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}