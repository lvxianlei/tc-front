const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 6; ++i) {
    records.push({
        "id": Random.increment(), 
        "issueNumber": Random.increment(), 
        "updateTime": Random.date('yyyy-MM-dd HH:mm'),
        "status|1-4": 1, 
        "createUserName": Random.cword(3,10), 
        "productCategoryName": Random.cword(3,10), 
        "recipientName": Random.cword(3,10), 
        "type|1-5": 1,
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "id": 5, 
            "issueNumber": Random.increment(), 
            "updateTime": Random.date('yyyy-MM-dd HH:mm'),
            "status|1-4": 1, 
            "createUserName": Random.cword(3,10), 
            "productCategoryName": Random.cword(3,10), 
            "recipientName": Random.cword(3,10), 
            "type": 5,
        },{
            "id": 1, 
            "issueNumber": Random.increment(), 
            "updateTime": Random.date('yyyy-MM-dd HH:mm'),
            "status|1-4": 1, 
            "createUserName": Random.cword(3,10), 
            "productCategoryName": Random.cword(3,10), 
            "recipientName": Random.cword(3,10), 
            "type": 1,
        },{
            "id": 2, 
            "issueNumber": Random.increment(), 
            "updateTime": Random.date('yyyy-MM-dd HH:mm'),
            "status|1-4": 1, 
            "createUserName": Random.cword(3,10), 
            "productCategoryName": Random.cword(3,10), 
            "recipientName": Random.cword(3,10), 
            "type": 2,
        },{
            "id": 3, 
            "issueNumber": Random.increment(), 
            "updateTime": Random.date('yyyy-MM-dd HH:mm'),
            "status|1-4": 1, 
            "createUserName": Random.cword(3,10), 
            "productCategoryName": Random.cword(3,10), 
            "recipientName": Random.cword(3,10), 
            "type": 3,
        },{
            "id": 4, 
            "issueNumber": Random.increment(), 
            "updateTime": Random.date('yyyy-MM-dd HH:mm'),
            "status|1-4": 1, 
            "createUserName": Random.cword(3,10), 
            "productCategoryName": Random.cword(3,10), 
            "recipientName": Random.cword(3,10), 
            "type": 4,
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}