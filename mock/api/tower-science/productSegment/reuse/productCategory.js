const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "description": Random.cword(3,10), 
		"id": Random.increment(),
		"name": Random.cword(3,10), 
		"singleCount": Random.increment(),
		"singleNumberCount": Random.increment(),
		"singleWeight": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "description": Random.cword(3,10), 
		"id": Random.increment(),
		"name": Random.cword(3,10), 
		"singleCount": Random.increment(),
		"singleNumberCount": Random.increment(),
		"singleWeight": Random.increment()
    }].concat(records)
}