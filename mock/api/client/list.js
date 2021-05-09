const Mock = require('mockjs');

const Random = Mock.Random;

const data = [];
for (let i = 0; i < 10; ++i) {
    data.push({
        "id": Random.increment(),
        "name": `${ Random.ctitle(7, 10) }有限公司`,
        "category|1-2": 1,
        "contact": Random.cname(),
        "phoneNumber": Random.natural(11),
        "comment": Random.csentence(10),
        "createdDateTime": Random.date('yyyy-MM-dd HH:mm')
    });
}

module.exports = {
    msg: "",
    code: 1,
    data: data
}