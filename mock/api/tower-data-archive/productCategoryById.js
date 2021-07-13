const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(),
        "description":  Random.natural(15),
        "lineName":  Random.natural(11),
        "productNumber":  Random.natural(11),
        "productTypeName":  Random.natural(11),
        "voltageGradeName":  Random.natural(11),
        "productHeight":  Random.natural(11),
        "productType": Random.natural(11),
        "bodyWeight":  Random.natural(11),
        "towerLeg1Length":  Random.increment(2),
        "towerLeg1Weight":  Random.increment(11),
        "towerLeg2Length":  Random.increment(3),
        "towerLeg2Weight":  Random.increment(11),
        "towerLeg3Length":  Random.increment(2),
        "towerLeg3Weight":  Random.increment(11),
        "towerLeg4Length":  Random.increment(3),
        "towerLeg4Weight":  Random.increment(11),
        "towerFootWeight": Random.increment(3),
        "productWeight": Random.increment(1,1000),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 111,
            "description":  Random.natural(15),
            "lineName":  Random.natural(11),
            "productNumber":  Random.natural(11),
            "productTypeName":  Random.natural(11),
            "voltageGradeName":  Random.natural(11),
            "productHeight":  Random.natural(11),
            "productType": Random.natural(11),
            "bodyWeight":  Random.natural(11),
            "towerLeg1Length":  Random.increment(2),
            "towerLeg1Weight":  Random.increment(11),
            "towerLeg2Length":  Random.increment(3),
            "towerLeg2Weight":  Random.increment(11),
            "towerLeg3Length":  Random.increment(2),
            "towerLeg3Weight":  Random.increment(11),
            "towerLeg4Length":  Random.increment(3),
            "towerLeg4Weight":  Random.increment(11),
            "towerFootWeight": Random.increment(3),
            "productWeight": Random.increment(2),
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}