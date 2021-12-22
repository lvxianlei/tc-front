const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({   
        "angle110":"100/0/1/50",
        "angle160":"100/0/1/50",
        "angle161":"100/0/1/50",
        "angle40":"100/0/1/50",
        "angle50":"100/0/1/50",
        "angle63":"100/0/1/50",
        "angle70":"100/0/1/50",
        "angle75":"100/0/1/50",
        "angle90":"100/0/1/50",
        "endTime":Random.date('yyyy-MM-dd HH:mm'),
        "id":Random.increment(),
        "orderProjectName":"dolor",
        "planNumber":"sed",
        "productCategoryName":`${ Random.ctitle(7, 10) }`,
        "productNum":Random.increment(),
        "unitId":Random.increment(),
        "unitName":`${ Random.ctitle(7, 10) }`,
        "weight":Random.increment(),
        "workPlanNumber":Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data:  [{
        "angle110":"500/0/1/50",
        "angle160":"400/0/1/50",
        "angle161":"500/0/1/50",
        "angle40":"160/0/1/50",
        "angle50":"170/0/1/50",
        "angle63":"100/0/5/50",
        "angle70":"100/0/1/70",
        "angle75":"100/0/1/30",
        "angle90":"100/0/1/20",
        "endTime":Random.date('yyyy-MM-dd HH:mm'),
        "id":Random.increment(),
        "orderProjectName":"dolor",
        "planNumber":"sed",
        "productCategoryName":`${ Random.ctitle(7, 10) }`,
        "productNum":Random.increment(),
        "unitId":Random.increment(),
        "unitName":`${ Random.ctitle(7, 10) }`,
        "weight":Random.increment(),
        "workPlanNumber":Random.increment()
    }].concat(records)
}