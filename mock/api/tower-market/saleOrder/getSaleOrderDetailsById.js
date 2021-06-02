const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
const pro  = [];
for (let i = 1; i < 5; ++i) {
    pro.push({
        "description": Random.natural(15),
        "lineName": Random.natural(15),
        "num": Random.increment(5),
        "price": Random.increment(5),
        "productHeight": Random.increment(5),
        "productNumber": Random.natural(15),
        "productShape":	 Random.natural(15),
        "productStatus|1-3": 1,
        "productType|1-2": 1,
        "saleOrderId": Random.increment(5)
    });
}
for (let i = 1; i < 5; ++i) {
    records.push({
        "id": Random.increment(),
        "taxAmount": Random.increment(3),
        "orderQuantity": Random.increment(4),
        "internalNumber": Random.increment(4),
        "products": pro,
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: records
}