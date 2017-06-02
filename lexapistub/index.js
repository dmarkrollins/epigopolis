'use strict';

const AWS = require('aws-sdk');

const payload = {};

payload.botAlias = 'Prod';
payload.botName = 'coffeeBot'
payload.userId = '18602223333';
payload.sessionAttributes = null;
payload.inputText = 'I want a mocha';
payload.sessionAttributes = {};
payload.sessionAttributes.beverageSize = 'Large';
payload.sessionAttributes.creamerType = 'Cream';

const options = {};
options.accessKeyId = "***";
options.secretAccessKey = "***";
// options.region = AWS.LexRuntime.region..
AWS.config.update({ region: 'us-east-1' });

const lex = new AWS.LexRuntime(options);

lex.postText(payload, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data))
    }
});