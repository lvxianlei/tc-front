const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
		"id": Random.increment(),        
        "taskNum": Random.increment(),
        "priority|1-3": 1,
        "externalTaskNum": Random.increment(),
        "saleOrderNumber": Random.increment(),
        "internalNumber": Random.increment(),
        "productCategoryName": Random.cword(3,10),
        "smallSampleDeliverTime": Random.date('yyyy-MM-dd HH:mm'),
        "smallSampleLeaderName": Random.cword(3,10),
        "smallSampleStatus|1-5": 1,
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '9', 
            "taskNum": Random.increment(),
            "priority|1-3": 1,
            "externalTaskNum": Random.increment(),
            "saleOrderNumber": Random.increment(),
            "internalNumber": Random.increment(),
            "productCategoryName": Random.cword(3,10),
            "smallSampleDeliverTime": Random.date('yyyy-MM-dd HH:mm'),
            "smallSampleLeaderName": Random.cword(3,10),
            "smallSampleStatus|1-5": 1,
            "updateStatusTime": Random.date('yyyy-MM-dd HH:mm')
        }].concat(records)
    }
}