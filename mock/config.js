const path = require('path');
const fs = require('fs');

let config = {};

const apiFolder = path.join(__dirname, './api');

traverseFiles(apiFolder);

function traverseFiles(filePath) {
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) { // if the path is a dir, look into files in the dir.
        fs.readdirSync(filePath).forEach((file) => { // loop files in the dir, and recursive all of them.
            traverseFiles(path.join(filePath, file));
        });
    } else { // file
        const apiPath = filePath.replace(apiFolder, '').replace(/(\.js$)|(\.json$)|(\.jsonc$)/, '').replace(/\\+/g, '/');
        config[apiPath] = {
            path: filePath
        };
    }
}

module.exports = config;