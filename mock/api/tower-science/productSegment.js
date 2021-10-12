const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "checkUser": Random.cword(3,10), 
		"priority|1-3": 1,
		"checkUserName": Random.cword(3,10), 
		"count": "culpa sed Duis sint",
		"id": Random.increment(),
		"loftingUser": Random.cword(3,10), 
		"loftingUserName": Random.cword(3,10), 
		"name": Random.cword(3,10), 
		"pattern|1-3": 1,
		"plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
		"productCategory": Random.increment(),
		"productCategoryName": Random.cword(3,10), 
		"status|1-5": 1,
		"updateStatusTime": Random.date('yyyy-MM-dd HH:mm')
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "id": 'productSegment111', 
        "checkUser": Random.cword(3,10), 
        "priority|1-3": 1,
        "checkUserName": Random.cword(3,10), 
        "count": "culpa sed Duis sint",
        "id": Random.increment(),
        "loftingUser": Random.cword(3,10), 
        "loftingUserName": Random.cword(3,10), 
        "name": Random.cword(3,10), 
        "pattern|1-3": 1,
        "plannedDeliveryTime": Random.date('yyyy-MM-dd HH:mm'), 
        "productCategory": Random.increment(),
        "productCategoryName": Random.cword(3,10), 
        "status|1-5": 1,
        "updateStatusTime": Random.date('yyyy-MM-dd HH:mm')
    }].concat(records)
}