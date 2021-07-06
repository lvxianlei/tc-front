const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": 10,
        "materialCategory": Random.increment(),
        "materialCode": Random.increment(),
        "materialTexture": Random.increment(),
        "middleCategory": Random.increment(),
        "productName": Random.increment(),
        "proportion": Random.increment(),
        "rowMaterial": Random.increment(),
        "shortcutCode": Random.increment(),
        "smallCategory": Random.increment(),
        "spec": Random.increment(),
        "unit": Random.increment(),
        "weightAlgorithm": Random.ctitle(7, 10),
        "field_3": 1,
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 11,
            "materialCategory": Random.increment(),
            "materialCode": Random.increment(),
            "materialTexture": Random.increment(),
            "middleCategory": Random.increment(),
            "productName": Random.increment(),
            "proportion": Random.increment(),
            "rowMaterial": Random.increment(),
            "shortcutCode": Random.increment(),
            "smallCategory": Random.increment(),
            "spec": Random.increment(),
            "unit": Random.increment(),
            "weightAlgorithm": Random.ctitle(7, 10),
            "field_3": 1,
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}