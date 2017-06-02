'use strict';
var Edmunds = require('./src/edmundsapi.js');

// exports.handler = function(event, context){
//     Edmunds.decodeVin(event.vin, function(err, result){
//         console.log(result.make);
//     });
// }

Edmunds.decodeVin("2G1FC3D33C9165616", function(err, result){
        console.log(result.price.usedTmvRetail);
    });