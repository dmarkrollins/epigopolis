'use strict';

const MongoClient = require('mongodb').MongoClient;
let cachedDb = null;

exports.handler = function(event, context, callback){
    processEvent(event, context, callback);
}

function processEvent(event, context, callback) {
    var uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    context.callbackWaitsForEmptyEventLoop = false;
    
    try {
        //testing if the database connection exists and is connected to Atlas so we can try to re-use it
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            createDoc(cachedDb, event, callback);
        }
        else {
            //some performance penalty might be incurred when running that database connection initialization code
            console.log(`=> connecting to database ${uri}`);
            MongoClient.connect(uri, function (err, db) {
                if (err) {
                    console.log("the error is ${err}.", err)
                    callback("Unable to connect to database");
                }
                cachedDb = db;
                return createDoc(db, event, callback);
            });            
        }
    }
    catch (err) {
        console.error('an error occurred', err);
        callback(`an error occurred ${err}`);
    }
}

function createDoc(db, json, callback) {
    console.log('creating doc');
    try {
        cachedDb.collection('Sessions').insertOne(json, function (err, result) {
            if (err !== null) {
                console.error("an error occurred in createDoc", err);
                callback(err);
            }
            else {
                console.log("Document created with id: " + result.insertedId);
                callback(null, "Document created with id: " + result.insertedId);
            }
        });
    } catch (ex) {
        console.log(ex);
    }
}