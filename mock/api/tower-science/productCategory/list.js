const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
		"boltDeliverTime": Random.date('yyyy-MM-dd'),
		"boltLeaderName": Random.cword(5,10),
		"boltStatus|1-5": 1,
		"combinedWeldingDeliverTime": Random.date('yyyy-MM-dd'),
		"combinedWeldingLeaderName": Random.cword(5,10),
		"combinedWeldingStatus": -76505735,
		"description": Random.cword(5,10),
		"id":  Random.increment(),
		"loftingDeliverTime": Random.date('yyyy-MM-dd'),
		"loftingLeaderName": Random.cword(5,10),
		"loftingStatus|1-5": 1,
		"loftingTask":  Random.natural(11),
		"loftingUserName": Random.cword(5,10),
		"materialDeliverTime": Random.date('yyyy-MM-dd'),
		"materialLeaderName": Random.cword(5,10),
		"materialStatus":  Random.natural(11),
		"materialUserName": Random.cword(5,10),
		"name": Random.cword(5,10),
		"num":  Random.natural(11),
		"smallSampleDeliverTime": Random.date('yyyy-MM-dd'),
		"smallSampleLeaderName": Random.cword(5,10),
		"smallSampleStatus":  Random.natural(11),
		"steelProductShape": Random.cword(5,10)
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
            "boltDeliverTime": Random.date('yyyy-MM-dd'),
            "boltLeaderName": Random.cword(5,10),
            "boltStatus|1-5": 1,
            "combinedWeldingDeliverTime": Random.date('yyyy-MM-dd'),
            "combinedWeldingLeaderName": Random.cword(5,10),
            "combinedWeldingStatus": -76505735,
            "description": Random.cword(5,10),
            "id":  Random.increment(),
            "loftingDeliverTime": Random.date('yyyy-MM-dd'),
            "loftingLeaderName": Random.cword(5,10),
            "loftingStatus|1-5": 1,
            "loftingTask":  Random.natural(11),
            "loftingUserName": Random.cword(5,10),
            "materialDeliverTime": Random.date('yyyy-MM-dd'),
            "materialLeaderName": Random.cword(5,10),
            "materialStatus":  -1,
            "materialUserName": Random.cword(5,10),
            "name": Random.cword(5,10),
            "num":  Random.natural(11),
            "smallSampleDeliverTime": Random.date('yyyy-MM-dd'),
            "smallSampleLeaderName": Random.cword(5,10),
            "smallSampleStatus":  Random.natural(11),
            "steelProductShape": Random.cword(5,10)
        }].concat(records)
}