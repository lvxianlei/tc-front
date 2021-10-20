const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "basicHeight": Random.increment(), 
        "basicHeightId": Random.increment(), 
        "id": Random.increment(), 
        "level": Random.increment(), 
        "name": Random.cword(3,10), 
        "productCategoryId": Random.increment(), 
        "singleWeight": Random.increment(), 
        "specs": Random.cword(3,10), 
        "subtotal": Random.increment(), 
        "total": Random.increment(), 
        "totalWeight": Random.increment(), 
        "type": Random.increment(), 
        "unbuckleLength": Random.increment(),
        "greenColumn": ["level"],
        "redColumn": ["singleWeight"],
        "yellowColumn": [],
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "basicHeight": Random.increment(), 
        "basicHeightId": Random.increment(), 
        "id": Random.increment(), 
        "level": Random.increment(), 
        "name": Random.cword(3,10), 
        "productCategoryId": Random.increment(), 
        "singleWeight": Random.increment(), 
        "specs": Random.cword(3,10), 
        "subtotal": Random.increment(), 
        "total": Random.increment(), 
        "totalWeight": Random.increment(), 
        "type": Random.increment(), 
        "unbuckleLength": Random.increment(),
        "greenColumn": [],
        "redColumn": ["total"],
        "yellowColumn": ["specs"],
    }].concat(records),
}