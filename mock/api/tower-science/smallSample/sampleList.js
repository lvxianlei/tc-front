const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
		"id": Random.increment(),        
        "componentCode": Random.increment(),
        "materialName": Random.cword(3,10),
        "partName": Random.cword(3,10),
        "smallSample": Random.cword(3,10),
        "status|1-5": 1,
        "uploadTime": Random.date('yyyy-MM-dd HH:mm')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": '9', 
            "componentCode": Random.increment(),
            "materialName": Random.cword(3,10),
            "partName": Random.cword(3,10),
            "smallSample": Random.cword(3,10),
            "status|1-5": 1,
            "uploadTime": Random.date('yyyy-MM-dd HH:mm')
        }].concat(records)
    }
}