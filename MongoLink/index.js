'use strict';
const MongoClient = require('mongodb').MongoClient;
var db = require("./src/dbInteractions.js");

exports.handler = function (event, context, callback) {
    processEvent(event, context, callback);
}

function processEvent(event, context, callback) {
    var uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        switch (event.transaction) {
            case "add":
                db.addDocument(event.data, function (err, result) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    console.log(result);
                    callback();
                });
                break;
        }
    }
    catch (err) {
        console.error('an error occurred', err);
        callback(`an error occurred ${err}`);
    }
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

function getDocumentById(callback) {
    db.getDocumentById("592d448ca593110879999de5", function (err, document) {
        if (err) {
            console.log(err);
            callback();
        }
        console.log(document);
        callback();
    });
}