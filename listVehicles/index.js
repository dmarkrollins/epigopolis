'use strict';

const greeting = require('greeting');

function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
            responseCard
        },
    };
}

function confirmIntent(sessionAttributes, intentName, slots, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName,
            slots,
            message,
            responseCard
        },
    };
}

function close(sessionAttributes, fulfillmentState, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
            responseCard
        },
    };
}

function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}

// build a message for Lex responses
function buildMessage(messageContent) {
    return {
        contentType: 'PlainText',
        content: messageContent
    };
}

function handleGreeting(intentRequest, callback) {

    // const questions = [
    //     'what kind of coffee would you like:',
    //     'tell me what you want:',
    //     'choose a drink type:',
    //     'what can I get you:',
    //     'which refreshing drink can I get you:',
    //     'select a hot beverage:'
    // ];

    // const idx = Math.floor(Math.random() * 6);

    const randomGreeting = greeting.random();

    const outputSessionAttributes = intentRequest.sessionAttributes;
    // const source = intentRequest.invocationSource;

    callback(close(outputSessionAttributes, 'Fulfilled', {
        contentType: 'PlainText',
        content: `Hey there... I can help you with your Travelers auto policy. What would you like help with? Say something like "my policy", "an accident", "my deductibles"`
    }));

}

// --------------- Intents -----------------------

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {

    const name = intentRequest.currentIntent.name;
    const sessionAttributes = intentRequest.sessionAttributes;

    if (name === 'PolicyOrAccident') {
        return handleVehicleList(intentRequest, callback);
    }

    if (name === 'DeductibleInquiry') {
        return handleDeductibleInquiry(intentRequest, callback);
    }

    callback(close(sessionAttributes, 'Fulfilled', {
        contentType: 'PlainText',
        content: `Intent with name ${name} not supported at this time...`
    }));

    //throw new Error(`Intent with name ${name} not supported`);
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {

    console.log(JSON.stringify(event));

    try {
        console.log(`event.bot.name=${event.bot.name}`);

        // fail if this function is for a different bot
        if (event.bot.name !== 'epigopolis') {
            callback('Invalid Bot Name');
        }

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};