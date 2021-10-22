const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "basicsPartNumNow|1-100": 1, 
        "basicsWeight": Random.increment(), 
        "description": Random.cword(3,10), 
        "id": Random.increment(), 
        "length": Random.increment(), 
        "materialName": Random.cword(3,10), 
        "code": Random.cword(3,10), 
        "segmentName": Random.cword(3,10), 
        "structureSpec": Random.cword(3,10), 
        "structureTexture": Random.cword(3,10), 
        "totalWeight": Random.increment(), 
        "width": Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "basicsPartNumNow": 5, 
        "basicsWeight": 999, 
        "description": Random.cword(3,10), 
        "id": 1211111, 
        "length": Random.increment(), 
        "materialName": Random.cword(3,10), 
        "code": Random.cword(3,10), 
        "segmentName": Random.cword(3,10), 
        "structureSpec": Random.cword(3,10), 
        "structureTexture": Random.cword(3,10), 
        "totalWeight": Random.increment(), 
        "width": Random.increment()
    }, {
        "basicsPartNumNow": 1, 
        "basicsWeight": 555, 
        "description": Random.cword(3,10), 
        "id": 121, 
        "length": Random.increment(), 
        "materialName": Random.cword(3,10), 
        "code": Random.cword(3,10), 
        "segmentName": Random.cword(3,10), 
        "structureSpec": Random.cword(3,10), 
        "structureTexture": Random.cword(3,10), 
        "totalWeight": Random.increment(), 
        "width": Random.increment()
    }].concat(records).concat({
        "basicsPartNumNow": 11, 
        "basicsWeight": Random.increment(), 
        "description": Random.cword(3,10), 
        "id": 7987, 
        "length": Random.increment(), 
        "materialName": Random.cword(3,10), 
        "code": Random.cword(3,10), 
        "segmentName": Random.cword(3,10), 
        "structureSpec": Random.cword(3,10), 
        "structureTexture": Random.cword(3,10), 
        "totalWeight": Random.increment(), 
        "width": Random.increment()
    })
}