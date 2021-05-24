const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 5; ++i) {
    records.push({
        "id": Random.increment(),
        "taxAmount": Random.increment(3),
        "orderQuantity": Random.increment(4),
        "products": {
            "description": Random.natural(15),
            "lineName": Random.natural(15),
            "num": Random.increment(5),
            "price": Random.increment(5),
            "productHeight": Random.increment(5),
            "productNumber": Random.natural(15),
            "productShape":	 Random.natural(15),
            "productStatus|1-3": 1,
            "productType|1-2": 1
        }
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
            "id": 2,
            "taxAmount": Random.increment(3),
            "orderQuantity": Random.increment(4),
            "products": {
                "description": Random.natural(15),
                "lineName": Random.natural(15),
                "num": Random.increment(5),
                "price": Random.increment(5),
                "productHeight": Random.increment(5),
                "productNumber": Random.natural(15),
                "productShape":	 Random.natural(15),
                "productStatus|1-3": 1,
                "productType|1-2": 1
            }
        }].concat(records),
}