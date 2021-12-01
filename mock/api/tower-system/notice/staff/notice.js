const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 4; ++i) {
    records.push({
        "id": Random.increment(),
        "content": Random.cword(3,10),
        "title": Random.cword(3,10),
        "attachVos":[
            {
                "description":"ullamco tempor eu dolore ea",
                "filePath":"eu ad ipsum",
                "fileSize":96027788.06026006,
                "fileSuffix":"do adipisicing qui cillum ullamco",
                "fileUploadTime":"1999-06-24T16:38:51.861Z",
                "id":59964705,
                "name":"amet tempor in exercitation ut",
                "userName":"amet"
            }
        ]
    });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
            "id": 11,
            "content": Random.cword(3,10),
            "title": Random.cword(3,10),
            "releaseTime": Random.date('yyyy-MM-dd'),
            "attachVos":[
                {
                    "description":"ullamco tempor eu dolore ea",
                    "filePath":"eu ad ipsum",
                    "fileSize":96027788.06026006,
                    "fileSuffix":"do adipisicing qui cillum ullamco",
                    "fileUploadTime":"1999-06-24T16:38:51.861Z",
                    "id":59964705,
                    "name":"amet tempor in exercitation ut",
                    "userName":"amet"
                },
                {
                    "description":"in esse Ut aliquip fugiat",
                    "filePath":"ullamco",
                    "fileSize":-95844304.11726315,
                    "fileSuffix":"exercitation in quis",
                    "fileUploadTime":"1999-07-11T10:19:58.16Z",
                    "id":-29953310,
                    "name":"q",
                    "userName":"magna aliquip"
                },
                {
                    "description":"Excepteur aute sunt",
                    "filePath":"quis in aliqua Duis",
                    "fileSize":-52123468.08230182,
                    "fileSuffix":"tempor",
                    "fileUploadTime":"2010-04-03T12:40:10.417Z",
                    "id":37852470,
                    "name":"occaecat velit incididunt",
                    "userName":"mol"
                },
                {
                    "description":"aliquip do mollit fugiat qui",
                    "filePath":"esse aliqu",
                    "fileSize":94277673.94568461,
                    "fileSuffix":"Ut",
                    "fileUploadTime":"2008-01-21T16:08:36.087Z",
                    "id":5988622,
                    "name":"dolore ut reprehenderit",
                    "userName":"ut aute de"
                }
            ]
        }].concat(records)
}