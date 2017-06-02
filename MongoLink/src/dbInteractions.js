'use strict';

const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let cachedDb = null;

//const uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
const uri = "mongodb://chatbot_user:qwerty123@ds155631.mlab.com:55631/chatbot";

module.exports = {
    addDocument: function (json, callback) {
        addDocument(json, callback);
    },
    queryDocument(query, callback) {
        queryDocument(query, callback);
    },
    updateDocument(id, json, callback) {
        updateDocument(id, json, callback);
    }
};

function connectToDatabase(callback) {
    try {
        if (!cachedDb || !cachedDb.serverConfig.isConnected()) {
            console.log(`=> connecting to database ${uri}`);
            MongoClient.connect(uri, function (err, db) {
                if (err) {
                    callback(`Unable to connect to database ${err}`);
                }
                cachedDb = db;
                callback(null);
            });
        } else {
            callback(null);
        }
    }
    catch (err) {
        callback(`an error occurred ${err}`);
    }
}

function addDocument(json, callback) {
    connectToDatabase(function (err) {
        if (err || !cachedDb.serverConfig.isConnected) {
            err = err || "Could not connect to database";
            callback(err);
            return;
        }

        try {
            cachedDb.collection('Sessions').insertOne(json, function (err, result) {
                if (err !== null) {
                    callback(`An error occurred: ${err}`);
                }
                else {
                    callback(null, "Document created with id: " + result.insertedId);
                }
            });
        } catch (ex) {
            callback(`An exception occurred: ${ex}`, null);
        }
    });
}

function queryDocument(query, callback) {
    connectToDatabase(function (err) {
        if (err || !cachedDb.serverConfig.isConnected) {
            err = err || "Could not connect to database";
            callback(err);
            return;
        }

        try {
            cachedDb.collection('Sessions').findOne(query, function (err, result) {
                if (err !== null) {
                    callback(`An error occurred: ${err}`, result);
                }
                else {
                    if (result === null) {
                        callback("Documents not found", null);
                        return;
                    }
                    callback(null, result);
                }
            });
        } catch (ex) {
            callback(`An exception occurred: ${ex}`, null);
        }
    });
}

function updateDocument(id, json, callback) {
    connectToDatabase(function (err) {
        if (err || !cachedDb.serverConfig.isConnected) {
            err = err || "Could not connect to database";
            callback(err);
            return;
        }

        try {
            cachedDb.collection('Sessions').findAndModify(
                { _id: ObjectId(id) },
                [],
                { $set: json },
                { new: true },
                function (err, document) {
                    callback(err, document);
                });

        } catch (ex) {
            callback(`An exception occurred: ${ex}`, null);
        }
    });
}
