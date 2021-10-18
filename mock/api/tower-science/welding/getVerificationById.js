const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 8; ++i) {
    records.push({
        "componentId": Random.cword(3,10), 
        "electricWeldingMeters": Random.increment(), 
        "id": Random.increment(), 
        "mainPartId": Random.cword(3,10), 
        "segmentName": Random.cword(3,10), 
        "singleGroupWeight": Random.increment(), 
        "verificationStatus|1-4": 1, 
        "weldingGroupId": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "componentId": Random.cword(3,10), 
            "electricWeldingMeters": Random.increment(), 
            "id": Random.increment(), 
            "mainPartId": Random.cword(3,10), 
            "segmentName": Random.cword(3,10), 
            "singleGroupWeight": Random.increment(), 
            "verificationStatus": -1, 
            "weldingGroupId": Random.increment()
        }, {
            "componentId": Random.cword(3,10), 
            "electricWeldingMeters": Random.increment(), 
            "id": Random.increment(), 
            "mainPartId": Random.cword(3,10), 
            "segmentName": Random.cword(3,10), 
            "singleGroupWeight": Random.increment(), 
            "verificationStatus": undefined, 
            "weldingGroupId": Random.increment()
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}