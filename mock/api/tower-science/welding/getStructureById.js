const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "code": Random.increment(), 
        "description": Random.cword(3,10), 
        "weldingLength": Random.increment(), 
        "id": Random.increment(), 
        "isMainPart": 0, 
        "length": Random.increment(), 
        "materialName": Random.cword(3,10), 
        "segmentId": Random.increment(), 
        "segmentName": Random.cword(3,10), 
        "singleNum": Random.increment(), 
        "structureId": Random.increment(), 
        "structureSpec": Random.cword(3,10), 
        "structureTexture": Random.cword(3,10), 
        "width":  Random.increment(), 
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "code": Random.increment(), 
        "description": Random.cword(3,10), 
        "weldingLength": Random.increment(), 
        "id": Random.increment(), 
        "isMainPart": 1, 
        "length": Random.increment(), 
        "materialName": Random.cword(3,10), 
        "segmentId": Random.increment(), 
        "segmentName": Random.cword(3,10), 
        "singleNum": Random.increment(), 
        "structureId": Random.increment(), 
        "structureSpec": Random.cword(3,10), 
        "structureTexture": Random.cword(3,10), 
        "width":  Random.increment(), 
    }].concat(records)
}