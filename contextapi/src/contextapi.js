'use strict';
const AWS = require('aws-sdk');

const payload = {};

payload.botAlias = 'Prod';
payload.botName = 'epigopolis';
payload.userId = '';
payload.sessionAttributes = null;

const options = {};
options.accessKeyId = process.env["AccessKeyId"];
options.secretAccessKey = process.env["SecretAccessKey"];

AWS.config.update({ region: 'us-east-1' });

const lex = new AWS.LexRuntime(options);
const lambda = new AWS.lambda({ region: 'us-east-1' });

module.exports = {

    sendToLex: function(userid, session, payload, callback) {

        payload.userId = userid;
        payload.sessionAttributes = session;
        payload.inputText = message;

        lex.postText(payload, function(err, data) {
            if (err) {
                console.log(`Lex API Error: ${JSON.stringify(err)}`);
            }
            callback(err, data);
        });
    },

    readDB: function(id, data, callback) {
        const payload = {};

        payload.transaction = 'read';
        payload.contextId = id;
        payload.data = data;

        lambda.invoke({
            FunctionName: 'MongoLink',
            Payload: JSON.stringify(payload, null, 2) // pass params
        }, function(error, data) {
            callback(error, data);
        });
    },

    writeDB: function(id, data, callback) {
        const payload = {};

        payload.transaction = 'update';
        payload.contextId = id;
        payload.data = data;

        lambda.invoke({
            FunctionName: 'update',
            Payload: JSON.stringify(event, null, 2) // pass params
        }, function(error, data) {
            callback(error, data);
        });
    }
};