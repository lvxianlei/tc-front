const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "componentCode": Random.increment(), 
		"createUserName": Random.cword(3,10), 
        "createTime": Random.date('yyyy-MM-dd HH:mm'),
		"id": Random.increment(),
		"ncCode": Random.cword(3,10), 
		"ncName": Random.cword(3,10), 
		"partName": Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "componentCode": Random.increment(), 
            "createUserName": Random.cword(3,10), 
            "createTime": Random.date('yyyy-MM-dd HH:mm'),
            "id": Random.increment(),
            "ncCode": Random.cword(3,10), 
            "ncName": Random.cword(3,10), 
            "partName": Random.cword(3,10)
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}