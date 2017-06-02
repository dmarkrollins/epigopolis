'use strict';
const policyData = require('./src/policyData.js');
const conciergeData = require('./src/conciergeData.js');

module.exports = function (event, context) {
    switch (event.type) {
        case "policy":
            return policyData.getPolicy(event);
        case "concierge":
            return conciergeData.getConciergeData(event);
    }
};



// var event = {};
// event.mobileNumber = "8601234567";
// console.log(policyData.getPolicy(event));

// console.log(conciergeData.getConciergeData({}));