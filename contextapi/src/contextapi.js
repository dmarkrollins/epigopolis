'use strict';
const AWS = require('aws-sdk');

const payload = {};

payload.botAlias = 'Prod';
payload.botName = 'coffeeBot'
payload.userId = '18602223333';
payload.sessionAttributes = null;

const options = {};
options.accessKeyId = process.env["AccessKeyId"];
options.secretAccessKey = process.env["SecretAccessKey"];

AWS.config.update({ region: 'us-east-1' });

module.exports = function () {
    postText = function (payload, callback) {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data))
        }
    },
        sendToDatabase = function (data, callback) {
            lambda.invoke({
                FunctionName: 'MongoLink',
                Payload: JSON.stringify(event, null, 2) // pass params
            }, function (error, data) {
                if (error) {
                    context.done('error', error);
                }
                if (data.Payload) {
                    context.succeed(data.Payload)
                }
            });
        }
};