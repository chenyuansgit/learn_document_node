"use strict"
var fs = require('fs');

exports.fileToLowerCase = function (myfile) {
    console.log(myfile);

    if (fs.existsSync(myfile)) {
        var content = fs.readFileSync(myfile, 'utf8');
        console.log(content.toLowerCase());
    } else {
        console.log("File does not exist - " + myfile);
    }
}