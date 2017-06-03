'use strict';

const _ = require('underscore');

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

function handlePolicyOrAccident(intentRequest, callback) {

    const session = intentRequest.sessionAttributes || {};
    const slots = intentRequest.currentIntent.slots;
    const policyAccident = slots.policyAccident;

    session.policyAccident = policyAccident;

    // const source = intentRequest.invocationSource;

    const vehicles = _.pluck(Policy.vehicles, 'make');

    callback(close(session, 'Fulfilled', {
        contentType: 'PlainText',
        content: `I see you have a ${vehicles[0]} and a ${vehicles[1]} on your policy. Which one do you need ${policyAccident} help with?`
    }));

}

function handleDeductibleInquiry(intentRequest, callback) {

    const randomGreeting = greeting.random();

    const session = intentRequest.sessionAttributes;
    // const source = intentRequest.invocationSource;

    callback(close(outputSessionAttributes, 'Fulfilled', {
        contentType: 'PlainText',
        content: 'Not implemented yet'
    }));

}

function handleMinorOrSevere(intentRequest, callback) {
    const session = intentRequest.sessionAttributes || {};

    const slots = intentRequest.currentIntent.slots;
    const damageSeverity = slots.damageSeverity;

    session.damageSeverity = damageSeverity;
    const carType = session.carType || null;

    const vehicle = _.find(Policy.vehicles, function(item) {
        return item.make.toLowerCase() === carType.toLowerCase();
    });

    let content = session.damageSeverity.toLowerCase() === "major" ? `Ok so for major damage on ${vehicle.year} ${carType} ${vehicle.model}s, typical repair cost range betwen $12000 and $4000 and your ${vehicle.deductibles[0].text} deductible is ${vehicle.deductibles[0].amount}. Would you like to report a loss? Say 'report loss' or 'file a claim'"` :
        `If you already have an estimate for the damage to your ${carType} say 'have estimate' otherwise say 'need estimate'?"`

    callback(close(session, 'Fulfilled', {
        contentType: 'PlainText',
        content: content
    }));

}


function handleVehicleTypeSelection(intentRequest, callback) {

    const session = intentRequest.sessionAttributes || {};

    const slots = intentRequest.currentIntent.slots;
    const damageSeverity = slots.damageSeverity;

    session.damageSeverity = damageSeverity;
    const carType = session.carType || null;

    const vehicle = _.find(Policy.vehicles, function(item) {
        return item.make.toLowerCase() === carType.toLowerCase();
    });

    const v1 = `${vehicle.deductibles[0].text} - ${vehicle.deductibles[0].amount}`;
    const v2 = `${vehicle.deductibles[1].text} - ${vehicle.deductibles[1].amount}`;

    const cov = `Limits: ${Policy.limits}, Property Damage: ${Policy.propertyDamage}, Medical: ${Policy.medicalPayments}, Uninsured: ${Policy.uninsured}`;

    let suffix;
    if (session.policyAccident) {
        suffix = session.policyAccident.toLowerCase() === "accident" ? `Was the damage to your ${carType} "minor" or "severe"?` :
            "Would you like to speak with a policy professional about additional coverage? Say 'connect me'";
    } else {
        suffix = "Do you need more information about your policy or is this about a recent accident? Say 'my policy' or 'an accident'";
    }

    callback(close(session, 'Fulfilled', {
        contentType: 'PlainText',
        content: `Here are the current coverages and deductibles on the ${carType}: ${cov}, ${v1}, ${v2}. ${suffix}`
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
        return handlePolicyOrAccident(intentRequest, callback);
    }

    if (name === 'DeductibleInquiry') {
        return handleDeductibleInquiry(intentRequest, callback);
    }

    if (name === 'VehicleTypeSelection') {
        return handleVehicleTypeSelection(intentRequest, callback);
    }

    if (name === "MinorOrSevere") {
        return handleMinorOrSevere(intentRequest, callback);
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