'use strict';
var db = require("./src/dbInteractions.js");

addDocument(function(){
    process.exit(0);
});

function addDocument(callback) {
    db.addDocument({ "test": "doc" }, function (err, result) {
        if (err) {
            console.log(err);
            callback();
        }
        console.log(result);
        callback();
    });
}

function queryDocument(callback) {
    db.queryDocument({ "contextId": "qwerty123" }, function (err, document) {
        if (err) {
            console.log(err);
            callback();
        }
        console.log(document);
        callback();
    });
}

function updateDocument(callback) {
    db.updateDocument("592d448ca593110879999de5", { "with": "update from node js 3" }, function (err, document) {
        if (err) {
            console.log(err);
            callback();
        }
        console.log(document);
        callback();
    });
}
