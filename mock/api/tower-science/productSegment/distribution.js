const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id":Random.increment(),
        "name":Random.cword(5,10),
        "pattern|1-3": 1,
        "plannedDeliveryTime":Random.date('yyyy-MM-dd'),
        "productCategoryId":Random.increment(),
        "productCategoryName":Random.cword(5,10),
        "productId":Random.increment()
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        "productCategoryId": Random.increment(),
        "productId": Random.increment(),
        "productCategoryName": Random.cword(5,10),
        "productNumber": Random.natural(11),
        "materialDeliverTime": Random.date('yyyy-MM-dd'),
        "materialStatus|1-5": 1,
        "productSegmentVOList": [
            {
                "checkUser":96088972,
                "checkUserName":"nisi commodo veniam",
                "count":"122",
                "id":-45068205,
                "loftingUser":-32499957,
                "loftingUserName":"officia deserunt ipsum",
                "name":"incididunt",
                "pattern":-72889869,
                "plannedDeliveryTime":"1988-06-25T03:23:58.531Z",
                "productCategoryId":-83570496,
                "productCategoryName":"eu",
                "productId":-75513054,
                "status":-40178471,
                "updateStatusTime":"1974-03-20T10:37:24.282Z"
            }].concat(records)
    }
}