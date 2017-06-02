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
            case "read":
                var query = { "contextId": event.contextId };
                db.queryDocument(query, function (err, document) {
                    console.log(document);
                    console.log(err);
                    callback(err, document);
                });
                break;
            case "update":
                db.queryDocument({ "contextId": event.contextId }, function (err, result) {
                    if (err || result == null) {
                        db.addDocument(JSON.parse(event.data), function (err, result) {
                            console.log(document);
                            console.log(err);
                            callback(err, document);
                        });
                    } else {
                        db.updateDocument(event.contextId, JSON.parse(event.data), function (err, document) {
                            console.log(document);
                            console.log(err);
                            callback(err, document);
                        });
                    }
                });
                break;
        }
    }
    catch (err) {
        callback(`an error occurred ${err}`);
    }
}