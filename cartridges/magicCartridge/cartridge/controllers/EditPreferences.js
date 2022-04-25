var server = require("server");
var URLUtils = require("dw/web/URLUtils");

var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");

server.get(
    "Start",
    server.middleware.https,
    csrfProtection.generateToken,
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
        var Resource = require("dw/web/Resource");
        var CustomerMgr = require("dw/customer/CustomerMgr");
        var customer = CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        );
        var profile = customer.getProfile();
        var profileForm = server.forms.getForm("profile"); //gets the profile.xml form definition and converts it to a JSON object.
        profileForm.clear(); //clears the JSON object
        profileForm.customer.preferences_allowSMS.value =
            profile.custom.preferences_allowSMS;
        profileForm.customer.preferences_allowEmail.value =
            profile.custom.preferences_allowEmail;
        profileForm.customer.preferences_allowEmaiPromotional.value =
            profile.custom.preferences_allowEmaiPromotional;

        res.render("account/profile", {
            profileForm: profileForm, //adds the JSON object to the data for the template
            breadcrumbs: [
                {
                    htmlValue: Resource.msg("global.home", "common", null),
                    url: URLUtils.home().toString(),
                },
                {
                    htmlValue: Resource.msg(
                        "page.title.myaccount",
                        "account",
                        null
                    ),
                    url: URLUtils.url("Account-Show").toString(),
                },
            ],
        });
        next();
    }
);

server.post(
    "SaveProfile",
    server.middleware.https,
    csrfProtection.generateToken,
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
        var Transaction = require("dw/system/Transaction");
        var CustomerMgr = require("dw/customer/CustomerMgr");
        var customer = CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        );
        var profile = customer.getProfile();

        var allowSms = req.form.preferences_allowSMS;
        var allowEmail = req.form.preferences_allowEmail;
        var allowEmailPromotional = req.form.preferences_allowEmaiPromotional;

        Transaction.wrap(function () {
            profile.custom.preferences_allowSMS =
                allowSms === "true" ? true : false;
            profile.custom.preferences_allowEmail =
                allowEmail === "true" ? true : false;
            profile.custom.preferences_allowEmaiPromotional =
                allowEmailPromotional === "true" ? true : false;
        });
        res.render("savePreferences");
        next();
    }
);
module.exports = server.exports();
