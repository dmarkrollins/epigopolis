'use strict';

module.exports = {
    getConciergeData: function(event){
        return getConciergeData();
    }
};

function getConciergeData(){
    return [
        {
            "businessName": "",
            "address": {
                "street": "",
                "cityStateZip": ""
            }
        }
    ];
}