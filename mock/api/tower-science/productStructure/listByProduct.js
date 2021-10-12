const Mock = require('mockjs');

const Random = Mock.Random;

const records = [];
for (let i = 1; i < 10; ++i) {
    records.push(
        {
            "apertureNumber": Random.increment(),
            "basicsPartNum": Random.increment(),
            "basicsWeight": Random.increment(),
            "bend": Random.cword(3,10), 
            "chamfer":Random.cword(3,10), 
            "code": Random.increment(),
            "description":Random.cword(3,10), 
            "electricWelding":Random.cword(3,10), 
            "greenColumn":[
                "code"
            ],
            "groove":Random.cword(3,10), 
            "id": Random.natural(),
            "intersectingLine":Random.cword(3,10), 
            "length": Random.increment(),
            "materialName":Random.cword(3,10), 
            "ncName":Random.cword(3,10), 
            "openCloseAngle":Random.cword(3,10), 
            "partName":Random.cword(3,10), 
            "perforate":Random.cword(3,10), 
            "perimeter": Random.increment(),
            "redColumn":[
                "openCloseAngle"
            ],
            "rootClear":Random.cword(3,10), 
            "shovelBack":Random.cword(3,10), 
            "sides": Random.increment(),
            "slottedForm":Random.cword(3,10), 
            "squash":Random.cword(3,10), 
            "structureSpec":Random.cword(3,10), 
            "structureTexture":Random.cword(3,10), 
            "surfaceArea": Random.increment(),
            "thickness": Random.increment(),
            "totalWeight": Random.increment(),
            "weldingEdge": Random.increment(),
            "width": Random.increment(),
            "yellowColumn":[
                "totalWeight",
                "shovelBack"
            ]
        });
}

module.exports = {
    msg: "",
    code: 200,
    data: [{
        "apertureNumber": Random.increment(),
        "basicsPartNum": Random.increment(),
        "basicsWeight": Random.increment(),
        "bend": Random.cword(3,10), 
        "chamfer":Random.cword(3,10), 
        "code": Random.increment(),
        "description":Random.cword(3,10), 
        "electricWelding":Random.cword(3,10), 
        "greenColumn":[
            "code"
        ],
        "groove":Random.cword(3,10), 
        "id": Random.natural(),
        "intersectingLine":Random.cword(3,10), 
        "length": Random.increment(),
        "materialName":Random.cword(3,10), 
        "ncName":Random.cword(3,10), 
        "openCloseAngle":Random.cword(3,10), 
        "partName":Random.cword(3,10), 
        "perforate":Random.cword(3,10), 
        "perimeter": Random.increment(),
        "redColumn":[
            "openCloseAngle"
        ],
        "rootClear":Random.cword(3,10), 
        "shovelBack":Random.cword(3,10), 
        "sides": Random.increment(),
        "slottedForm":Random.cword(3,10), 
        "squash":Random.cword(3,10), 
        "structureSpec":Random.cword(3,10), 
        "structureTexture":Random.cword(3,10), 
        "surfaceArea": Random.increment(),
        "thickness": Random.increment(),
        "totalWeight": Random.increment(),
        "weldingEdge": Random.increment(),
        "width": Random.increment(),
        "yellowColumn":[
            "totalWeight",
            "shovelBack"
        ]
    }].concat(records)
}
