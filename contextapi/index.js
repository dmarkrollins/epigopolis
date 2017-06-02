'use strict';

// const api = require('./src/contextapi.js');

exports.handler = function(event, context, callback) {

    // event.userId
    // event.message
    // const userData = api.readDB(event.userId);

    console.log(`Event: ${JSON.stringify(event)}`);
    // console.log(`Context: ${JSON.stringify(context)}`);

    callback(null, 'We arrived');

};