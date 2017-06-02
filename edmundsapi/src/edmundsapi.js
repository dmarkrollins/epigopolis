'use strict';
var EdmundsClient = require('node-edmunds-api');
var client = new EdmundsClient({ apiKey: 'kezcmvktskauj4vspwjeza26' });

module.exports = {
    decodeVin: function (vin, callback) {
        client.decodeVin({ vin: vin }, function (err, result) {
            callback(err,result);
        });
    }
}