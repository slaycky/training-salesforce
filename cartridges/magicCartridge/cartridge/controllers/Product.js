"use strict";

/**
 * @namespace Product
 */

var server = require("server");
server.extend(module.superModule);

var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");

server.append(
    "Show",
    cache.applyPromotionSensitiveCache,
    consentTracking.consent,
    function (req, res, next) {
        var URLUtils = require("dw/web/URLUtils");
        var productHelper = require("*/cartridge/scripts/helpers/productHelpers");
        var showProductPageHelperResult = productHelper.showProductPage(
            req.querystring,
            req.pageMetaData
        );
        if (req.currentCustomer.profile) {
            var Transaction = require("dw/system/Transaction");
            var CustomerMgr = require("dw/customer/CustomerMgr");
            var customer = CustomerMgr.getCustomerByCustomerNumber(
                req.currentCustomer.profile.customerNo
            );
            var profile = customer.getProfile();
            Transaction.wrap(function () {
                profile.custom.lastViewedProductId =
                    showProductPageHelperResult.product.id;
            });
        }

        var productType = showProductPageHelperResult.product.productType;
        if (
            !showProductPageHelperResult.product.online &&
            productType !== "set" &&
            productType !== "bundle"
        ) {
            res.redirect(URLUtils.url("Home-Show"));
            next();
        }
        next();
    },
    pageMetaData.computedPageMetaData
);

module.exports = server.exports();
