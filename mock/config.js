const path = require('path');
const fs = require('fs');

let config = {};

traverseFiles(path.join(__dirname, './api'));

function traverseFiles(filePath) {
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) { // if the path is a dir, look into files in the dir.
        fs.readdirSync(filePath).forEach((file) => { // loop files in the dir, and recursive all of them.
            traverseFiles(path.join(filePath, file));
        });
    } else { // file
        const apiPath = filePath.replace(__dirname, '').replace(/(\.js$)|(\.json$)|(\.jsonc$)/, '');
        config[apiPath] = {
            path: filePath.replace(__dirname, '../../../mock')
        };
    }
}

module.exports = config;