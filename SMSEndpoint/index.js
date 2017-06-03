'use strict';

const AWS = require('aws-sdk');
const botBuilder = require('claudia-bot-builder');

const lambda = new AWS.Lambda({ region: 'us-east-1' });

// function callLamba(payload) {
// const promiseInvoke = ({ functionName, payload }) => {
//     console.log('Starting promiseInvoke with native promise');
//     return lambda.invoke({
//         InvocationType: 'Event',
//         FunctionName: functionName,
//         LogType: 'None',
//         Payload: JSON.stringify(payload)
//     }).promise();
// };

// const promiseInvoke6 = ({ functionName, payload }) => new Promise(resolve => {
//   console.log(`Starting promiseInvoke InvokeAsync without callback - ${functionName}`);
//   const request = lambda.invokeAsync({
//     FunctionName: functionName,
//     InvokeArgs: JSON.stringify(payload)
//   });
//   request.send();
//   resolve();
// });


// SMS entry point

module.exports = botBuilder(function(message) {

    console.log('Incoming message', JSON.stringify(message));

    const data = {};
    data.message = message.text;
    data.userId = message.sender;

    const payload = {
        functionName: 'ContextAPI',
        payload: JSON.stringify(data, null, 2)
    };

    try {
        fiber(function() {
            const result = sawait(lambda.invoke(payload, defer()));
            console.log(result);
            return result;
        });
    } catch (err) {
        console.log(err);

// module.exports = botBuilder(function (message) {

//     console.log('Incoming message', JSON.stringify(message));

//     const data = {};
//     data.message = message.text;
//     data.userId = message.sender;

//     const payload = {
//         functionName: 'ContextAPI',
//         payload: JSON.stringify(data, null, 2)
//     };

//     lambda.invoke(payload);

//     return message;

//     // promiseInvoke(payload).resolve().then(function(result) {
//     //     console.log(result);
//     //     return JSON.stringify(result);
//     // }).catch(function(err) {
//     //     console.log(err);
//     //     return 'error occurred';
//     // });

//     // console.log('done with promise');

//     // console.log(retval);

//     // return retval;

//     // const lambdaPromise = lambda.invoke(payload).promise();

//     // lambdaPromise.then(function(retval) {
//     //     return 'success';
//     // }).catch(function(err) {
//     //     return 'error';
//     // });

//     // lambda.invoke(payload, function(err, result) {
//     //     console.log('hi there');
//     //     let retval;
//     //     if (err) {
//     //         console.log('result error', err);
//     //         retval = null;
//     //     } else {
//     //         retval = result;
//     //     }
//     //     console.log('Return Value', retval);
//     //     return retval || 'Something happened - check the logs';
//     // });

//     //return 'This freakin better work';

// }, { platforms: ['twilio'] });