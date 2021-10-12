const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "basicsPartNum": Random.increment(),
		"basicsTheoryWeight": Random.increment(),
		"basicsWeight": Random.increment(),
		"code": Random.cword(3,10),
		"description": Random.cword(3,10),
		"greenColumn": ["code", "basicsWeight"],
		"id": Random.increment(),
		"length": Random.increment(),
		"materialName": Random.cword(3,10),
		"name": Random.cword(3,10),
		"productCategory": Random.increment(),
		"redColumn": ["segmentName", "thickness"],
		"segmentName": Random.cword(3,10),
		"structureSpec": Random.cword(3,10),
		"structureTexture": Random.cword(3,10),
		"thickness": Random.increment(),
		"totalWeight": Random.increment(),
		"width": Random.increment(),
		"yellowColumn": ["width"]
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "basicsPartNum": Random.increment(),
			"basicsTheoryWeight": Random.increment(),
			"basicsWeight": Random.increment(),
			"code": Random.cword(3,10),
			"description": Random.cword(3,10),
			"greenColumn": ["code", "basicsWeight"],
			"id": 6,
			"length": Random.increment(),
			"materialName": Random.cword(3,10),
			"name": Random.cword(3,10),
			"productCategory": Random.increment(),
			"redColumn": ["segmentName", "thickness"],
			"segmentName": Random.cword(3,10),
			"structureSpec": Random.cword(3,10),
			"structureTexture": Random.cword(3,10),
			"thickness": Random.increment(),
			"totalWeight": Random.increment(),
			"width": Random.increment(),
			"yellowColumn": ["width"]
        }].concat(records),
        current: Random.natural(1, 20),
        size: 10,
        total: Random.natural(1, 589)
    }
}