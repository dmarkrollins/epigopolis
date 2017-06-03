
module.exports = {
    getPolicy: function (event) {
        var policies = getPolicies();
        var policy;
        for (var p in policies) {
            if (policies[p].mobileNumber == event.mobileNumber) {
                policy = policies[p];
                console.log("found policy");
            }
        };
        return policy || "Policy Not Found";
    }
}

function getPolicies() {
    var policies = [{
        "fullName": "John Smith",
        "address": {
            "street": "12 Main St.",
            "cityStateZip": "Hartford, CT 06101"
        },
        "mobileNumber": "8601234567",
        "effectiveDate": "10/23/2016",
        "expirationDate": "10/13/2017",
        "limits": "100,000/300,000",
        "propertyDamage": "100,000 each accident",
        "medicalPayments": "$5,000 each person",
        "uninsured": "$100,000/$300,000",
        "deductibles": [{
            "text": "Comp/Comprehensive",
            "amount": "$500.00"
        },
        {
            "text": "Glass Deductible",
            "amount": "$50.00"
        }
        ]
    }];

    return policies;
}