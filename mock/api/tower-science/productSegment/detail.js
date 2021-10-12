const Mock = require('mockjs');

const Random = Mock.Random;

module.exports = {
    msg: "",
    code: 200,
    data: {
            "productCategoryName": Random.cword(5,10),
            "productCategory":  Random.increment(),
            "pattern|1-3": 1,
            "status|1-5": 1,
        }
}