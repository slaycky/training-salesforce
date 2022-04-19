var server = require("server");

server.get("Show", function (req, res, next) {
    var template = "Site";

    res.render(template);
    next();
});

module.exports = server.exports();
