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
        var template = "magic";
        res.render(template);

        // var accountHelpers = require("*/cartridge/scripts/account/accountHelpers");

        // var accountModel = accountHelpers.getAccountModel(req);
        // var profileForm = server.forms.getForm("profile"); //gets the profile.xml form definition and converts it to a JSON object.
        // profileForm.clear(); //clears the JSON object
        // profileForm.customer.firstname.value = accountModel.profile.firstName; //copies data from one field to another
        // profileForm.customer.lastname.value = accountModel.profile.lastName;
        // profileForm.customer.phone.value = accountModel.profile.phone;
        // profileForm.customer.email.value = accountModel.profile.email;
        // res.render("account/profile", {
        //     profileForm: profileForm, //adds the JSON object to the data for the template
        //     breadcrumbs: [
        //         {
        //             htmlValue: Resource.msg("global.home", "common", null),
        //             url: URLUtils.home().toString(),
        //         },
        //         {
        //             htmlValue: Resource.msg(
        //                 "page.title.myaccount",
        //                 "account",
        //                 null
        //             ),
        //             url: URLUtils.url("Account-Show").toString(),
        //         },
        //     ],
        // });
        next();
    }
);
