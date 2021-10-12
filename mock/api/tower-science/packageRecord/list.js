const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "balesCode": Random.natural(11),
        "description":  Random.cword(5,10),
        "id": Random.increment(),
        "length": Random.increment(),
        "materialSpec": Random.natural(11),
        "num": Random.increment(),
        "pieceCode": Random.natural(11),
        "productCategoryId": Random.increment(),
        "productCategoryName": Random.natural(11),
        "productId": Random.increment(),
        "productNumber": Random.natural(11),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        "productCategoryId":Random.increment(),
        "productCategoryName": Random.cword(5,10),
        "productId":Random.increment(),
        "productNumber": Random.increment(),
        "packageRecordVOList": [{
            "balesCode": Random.natural(11),
            "description":  Random.cword(5,10),
            "id": Random.increment(),
            "length": Random.increment(),
            "materialSpec": Random.natural(11),
            "num": Random.increment(),
            "pieceCode": Random.natural(11),
            "productCategoryId": Random.increment(),
            "productCategoryName": Random.natural(11),
            "productId": Random.increment(),
            "productNumber": Random.natural(11),
        }].concat(records)
    }
}