const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "description":  Random.natural(15),
        "internalNumber":  Random.natural(11),
        "label":  Random.natural(11),
        "materialTexture":  Random.natural(11),
        "operateStatus":  Random.natural(11),
        "partNumber":  Random.natural(11),
        "productShape":  Random.natural(11),
        "productShapeName":  Random.cword(5,10),
        "productType":  Random.natural(11),
        "projectName": Random.cword(5,10),
        "steelProductShape": Random.natural(11),
        "voltageGrade": Random.cword(5,10),
        "weight": Random.cword(5,10),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 111,
            "description":  Random.natural(15),
            "internalNumber":  Random.natural(11),
            "label":  Random.natural(11),
            "materialTexture":  Random.natural(11),
            "operateStatus":  Random.natural(11),
            "partNumber":  Random.natural(11),
            "productShape":  Random.natural(11),
            "productShapeName":  Random.cword(5,10),
            "productType":  Random.natural(11),
            "projectName": Random.cword(5,10),
            "steelProductShape": Random.natural(11),
            "voltageGrade": Random.cword(5,10),
            "weight": Random.cword(5,10),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}