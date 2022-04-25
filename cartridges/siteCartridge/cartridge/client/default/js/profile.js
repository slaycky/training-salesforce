"use strict";

var formValidation = require("../../../../../app_storefront_base/cartridge/client/default/js/components/formValidation");

module.exports = {
    submitProfilePreference: function () {
        $("edit-profile-preference-form").submit(function (e) {
            var $form = $(this);
            e.preventDefault();
            var url = $form.attr("action");
            $form.spinner().start();
            $("edit-profile-preference-form").trigger("profile:edit", e);
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: $form.serialize(),
                success: function (data) {
                    $form.spinner().stop();
                    if (!data.success) {
                        formValidation($form, data);
                    } else {
                        location.href = data.redirectUrl;
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    $form.spinner().stop();
                },
            });
            return false;
        });
    },

    submitPassword: function () {
        $("form.change-password-form").submit(function (e) {
            var $form = $(this);
            e.preventDefault();
            var url = $form.attr("action");
            $form.spinner().start();
            $("form.change-password-form").trigger("password:edit", e);
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: $form.serialize(),
                success: function (data) {
                    $form.spinner().stop();
                    if (!data.success) {
                        formValidation($form, data);
                    } else {
                        location.href = data.redirectUrl;
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    $form.spinner().stop();
                },
            });
            return false;
        });
    },
};
