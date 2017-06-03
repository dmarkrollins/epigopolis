'use strict';
const policyData = require('./src/policyData.js');
const conciergeData = require('./src/conciergeData.js');

module.exports = {
    getPolicy: function () {
        return policyData.getPolicy(event);
    },
    getConcierge: function (type) {
        return conciergeData.getConciergeData(event);
    }
};



// var event = {};
// event.mobileNumber = "8601234567";
// console.log(policyData.getPolicy(event));

// console.log(conciergeData.getConciergeData({}));