const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id": Random.increment(), 
        "status|1-4": 1,
        "angleWeight": Random.increment(),
        "deliveryTime": Random.date('yyyy-MM-dd HH:mm'),
        "galvanizedStartTime": Random.date('yyyy-MM-dd HH:mm'),
        "internalNumber": Random.increment(),
        "issueWeight": Random.increment(),
        "maintenanceTeamName":Random.cword(3,10),
        "orderName":Random.cword(3,10),
        "packagingTeamName":Random.cword(3,10),
        "picklingTeamName":Random.cword(3,10),
        "planNo":"in quis",
        "plateGalvanizedCompleteTime": Random.date('yyyy-MM-dd HH:mm'),
        "plateWeight": Random.increment(),
        "potGalvanizedCompleteTime": Random.date('yyyy-MM-dd HH:mm'),
        "productCategoryId": Random.increment(),
        "productCategoryName":Random.cword(3,10),
        "productDeliveryTime": Random.date('yyyy-MM-dd HH:mm'),
        "productNum": Random.increment(),
        "voltageGrade":Random.cword(3,10),
        "wearHangTeamName":Random.cword(3,10),
        "zincPotTeamName":Random.cword(3,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: {
            "angleTotalWeight":78773249.68602762,
            "issueTotalWeight":44386060.2768082,
            "plateTotalWeight":65125021.74871959,
            galvanizedDailyPlanVOS: [{
                "id": "123456", 
                "status|1-4": 1,
                "angleWeight": Random.increment(),
                "deliveryTime": Random.date('yyyy-MM-dd HH:mm'),
                "galvanizedStartTime": Random.date('yyyy-MM-dd HH:mm'),
                "internalNumber": Random.increment(),
                "issueWeight": Random.increment(),
                "maintenanceTeamName":Random.cword(3,10),
                "orderName":Random.cword(3,10),
                "packagingTeamName":Random.cword(3,10),
                "picklingTeamName":Random.cword(3,10),
                "planNo":"in quis",
                "plateGalvanizedCompleteTime": Random.date('yyyy-MM-dd HH:mm'),
                "plateWeight": Random.increment(),
                "potGalvanizedCompleteTime": Random.date('yyyy-MM-dd HH:mm'),
                "productCategoryId": Random.increment(),
                "productCategoryName":Random.cword(3,10),
                "productDeliveryTime": Random.date('yyyy-MM-dd HH:mm'),
                "productNum": Random.increment(),
                "voltageGrade":Random.cword(3,10),
                "wearHangTeamName":Random.cword(3,10),
                "zincPotTeamName":Random.cword(3,10)
            }].concat(records)
        },
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}