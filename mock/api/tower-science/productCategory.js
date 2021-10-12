const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "basicHeight": Random.cword(3,10), 
		"productCategoryName": Random.cword(3,10), 
		"id": Random.increment(),
		"steelProductShape": Random.cword(3,10), 
		"externalTaskNum": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "basicHeight": Random.cword(3,10), 
            "productCategoryName": Random.cword(3,10), 
            "id": Random.increment(),
            "steelProductShape": Random.cword(3,10), 
            "externalTaskNum": Random.increment()
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}