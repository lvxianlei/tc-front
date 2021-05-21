const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "code":  Random.natural(5),
        "name":  Random.cword(3,10),
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: {
        records: [{
            "code":  "5",
            "name":  Random.cword(3,10),
        }].concat(records)
    }
}