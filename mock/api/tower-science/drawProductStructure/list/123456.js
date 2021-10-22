const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "basicsPartNum": Random.increment(), 
        "basicsTheoryWeight": Random.increment(), 
        "basicsWeight": Random.increment(), 
        "code": Random.cword(3,10),
        "description": Random.cword(3,10),
        "length": Random.increment(), 
        "materialName": Random.cword(3,10),
        "name":"",
        "productCategory": Random.increment(), 
        "segmentName": Random.cword(3,10),
        "structureSpec": Random.cword(3,10),
        "structureTexture": Random.cword(3,10),
        "thickness": Random.increment(), 
        "totalWeight": Random.increment(), 
        "width": Random.increment(), 
        "drawBasicsWeight": Random.cword(3,10),
        "basicsPartWeight": Random.cword(3,10),
        "drawPartWeight": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "id": '12121', 
        "internalNumber": Random.increment(), 
        "name": Random.cword(3,10),
        "pattern|1-3": 1,
        "saleOrderNumber": Random.increment(), 
        "steelAngleCount": Random.increment(), 
        "steelPlateCount": Random.increment(), 
        "steelProductShape": Random.cword(3,10),
        "structureCount": Random.increment(), 
        "taskCode": Random.increment(), 
        "updateTime": Random.date('yyyy-MM-dd HH:mm'), 
        "updateUser": Random.increment(), 
        "updateUserName": Random.cword(3,10)
    }].concat(records)
}