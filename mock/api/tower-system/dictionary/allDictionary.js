const Mock = require('mockjs');

const Random = Mock.Random;

const dict = [];
for (let i = 1; i < 10; ++i) {
    dict.push({
        "id":  Random.natural(5),
        "name":  Random.cword(3,10),
    });
}

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push({
        "id":  Random.natural(5),
        "name":  Random.cword(3,10),
        dictionaryTypes: dict
    });
}


module.exports = {
    msg: "",
    code: 200,
    data: [{
        "id":  101,
        "name":  Random.cword(3,10),
        dictionaryTypes: dict
    }].concat(records)
}