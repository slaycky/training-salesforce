var server = require("server");
var URLUtils = require("dw/web/URLUtils");
var Logger = require("dw/system/Logger");

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

server.get("Newsletter", function (req, res, next) {
    var actionUrl = URLUtils.url("EditPreferences-SaveNewsletter"); //sets the route to call for the form submit action
    var newsLetterForm = server.forms.getForm("newsletter"); //creates empty JSON object using the form definition
    newsLetterForm.clear();

    res.render("newsletter/subscribe", {
        actionUrl: actionUrl,
        newsLetterForm: newsLetterForm,
    });
    next();
});

server.post("SaveNewsletter", function (req, res, next) {
    var name = req.form.name;
    var email = req.form.email;
    var Transaction = require("dw/system/Transaction");
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");

    var template = "newsletter/success";
    var data = {};
    try {
        Transaction.wrap(function () {
            var notificationObject = CustomObjectMgr.createCustomObject(
                "newsletterCustom",
                email
            );
            notificationObject.custom.email = email;
            notificationObject.custom.name = name;
        });
        data = {
            name: name,
        };
    } catch (e) {
        data = {
            error: "E-mail already exists",
            e: e,
        };
        var logger = Logger.getLogger("myLog");
        logger.error("Error => E-mail already exists");
        template = "newsletter/failure";
    }
    res.render(template, data);
    next();
});
module.exports = server.exports();
