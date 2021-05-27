const Mock = require('mockjs');

const Random = Mock.Random;

const data = [];
for (let i = 1; i < 10; ++i) {
    data.push({
        "code": Random.increment(),
        "name": Random.ctitle(),
        "parentCode":  Random.increment(),
        "sort": Random.natural(3),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "code": '1',
        "name": Random.ctitle(),
        "parentCode": Random.increment(),	
        "sort": Random.natural(3),
    }].concat(data),
    
}