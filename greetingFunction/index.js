'use strict';

const greeting = require('greeting');

const Policy = {
    "firstName": "John",
    "lastName": "Smith",
    "prefix": "Mr.",
    "address": {
        "street": "12 Main St.",
        "cityStateZip": "Hartford, CT 06101"
    },
    "mobileNumber": "8601234567",
    "effectiveDate": "10/23/2016",
    "expirationDate": "10/13/2017",
    "limits": "$100,000/$300,000",
    "propertyDamage": "$100,000 each accident",
    "medicalPayments": "$5,000 each person",
    "uninsured": "$100,000/$300,000",
    "vehicles": [{
            "make": "Honda",
            "model": "Accord",
            "style": "Sport",
            "year": "2012",
            "deductibles": [{
                "text": "Comp/Comprehensive",
                "amount": "$700.00"
            }, {
                "text": "Glass Deductible",
                "amount": "$50.00"
            }],
        },
        {
            "make": "Ford",
            "model": "Fusion",
            "style": "Titanium",
            "year": "2014",
            "deductibles": [{
                    "text": "Comp/Comprehensive",
                    "amount": "$500.00"
                },
                {
                    "text": "Glass Deductible",
                    "amount": "$50.00"
                }
            ],
        }
    ]
};

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
        content: `${randomGreeting} ${Policy.prefix} ${Policy.lastName}... what can I help you with? Say something like "my policy", "an accident", or "my deductibles"`
    }));

}

// --------------- Intents -----------------------

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {

    const name = intentRequest.currentIntent.name;
    const sessionAttributes = intentRequest.sessionAttributes;

    if (name === 'Greeting') {
        return handleGreeting(intentRequest, callback);
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