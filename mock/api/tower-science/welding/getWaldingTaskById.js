const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "createDept": Random.increment(), 
        "createDeptName": Random.cword(3,10), 
        "createTime": Random.date('yyyy-MM-dd HH:mm'), 
        "createUser": Random.increment(), 
        "createUserName": Random.cword(3,10), 
        "description": Random.cword(3,10), 
        "id": Random.increment(), 
        "currentStatus|1-5": 1
    });
}

const attachInfoList = [];
for (let i = 1; i < 10; ++i) {
    attachInfoList.push({
        "description": Random.cword(3,10), 
        "filePath": Random.cword(3,10), 
        "fileSize": Random.increment(), 
        "fileSuffix": Random.cword(3,10), 
        "fileUploadTime": Random.date('yyyy-MM-dd HH:mm'), 
        "id": Random.increment(), 
        "name": Random.cword(3,10), 
        "userName": Random.cword(3,10) 
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        "galvanizeDemand": Random.cword(3,10), 
        "id": Random.increment(), 
        "loftingTaskId": Random.increment(), 
        "materialDemand": Random.cword(3,10), 
        "materialStandard": Random.cword(3,10), 
        "packDemand": Random.cword(3,10), 
        "peculiarDescription": Random.cword(3,10), 
        "productModelNum": Random.increment(), 
        "productNum": Random.increment(), 
        "productType": Random.cword(3,10), 
        "totalWeight": Random.increment(), 
        "weldingDemand": Random.cword(3,10), 
        "statusRecordList": [
            {
                "createDept": Random.increment(), 
                "createDeptName": Random.cword(3,10), 
                "createTime": Random.date('yyyy-MM-dd HH:mm'), 
                "createUser": Random.increment(), 
                "createUserName": Random.cword(3,10), 
                "description": Random.cword(3,10), 
                "id": Random.increment(), 
                "currentStatus|1-5": 1
            }
        ].concat(records),
        "attachInfoList": [{
            "description": Random.cword(3,10), 
            "filePath": Random.cword(3,10), 
            "fileSize": Random.increment(), 
            "fileSuffix": Random.cword(3,10), 
            "fileUploadTime": Random.date('yyyy-MM-dd HH:mm'), 
            "id": Random.increment(), 
            "name": Random.cword(3,10), 
            "userName": Random.cword(3,10)
        }].concat(attachInfoList)
    }
}