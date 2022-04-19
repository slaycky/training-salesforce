var server = require("server");
var URLUtils = require("dw/web/URLUtils");

server.get("Show", function (req, res, next) {
    var template = "magic";
    res.render(template);
    next();
});

server.get("Product", function (req, res, next) {
    var template = "product";
    var myproduct = { pid: "701644329402M" };
    var ProductFactory = require("*/cartridge/scripts/factories/product");
    var product = ProductFactory.get(myproduct);

    res.render(template, {
        product: product,
    });
    next();
});

server.get("Basket", function (req, res, next) {
    var template = "basket";
    var BasketMgr = require("dw/order/BasketMgr");
    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket) {
        res.setStatusCode(500);
        res.json({
            error: true,
            redirectUrl: URLUtils.url("Cart-Show").toString(),
        });
    }
    var productLineItems = currentBasket.allProductLineItems;
    res.render(template, {
        productLineItems: productLineItems,
    });
    next();
});

server.get("Decorator", function (req, res, next) {
    var template = "decorator";
    var myproduct = { pid: "701644329402M" };
    var ProductFactory = require("*/cartridge/scripts/factories/product");
    var product = ProductFactory.get(myproduct);

    res.render(template, {
        product: product,
    });
    next();
});
server.get("Explore", function (req, res, next) {
    var template = "explore";
    var printMe = "OLA TESTE de ISML";
    var loopArray = [
        "Product",
        "Product",
        "Product",
        "Product",
        "Product",
        "Product",
        "Product",
    ];
    var myproduct = { pid: "701644329402M" };
    var BasketMgr = require("dw/order/BasketMgr");
    var currentBasket = BasketMgr.getCurrentBasket();
    var ProductFactory = require("*/cartridge/scripts/factories/product");
    var product = ProductFactory.get(myproduct);
    res.render(template, {
        page: printMe,
        loopArray: loopArray,
        product: product,
        Basket: currentBasket,
    });
    next();
});

server.get("Category", function (req, res, next) {
    var template = "category";
    var CatalogMgr = require("dw/catalog/CatalogMgr");
    var ProductFactory = require("*/cartridge/scripts/factories/product");
    var ProductSearchModel = require("dw/catalog/ProductSearchModel");
    var apiProductSearch = new ProductSearchModel();
    var PagingModel = require("dw/web/PagingModel");
    var category = CatalogMgr.getCategory("womens");
    var pagingModel;
    var products = [];
    apiProductSearch.setCategoryID(category.ID);
    apiProductSearch.search();
    pagingModel = new PagingModel(
        apiProductSearch.getProductSearchHits(),
        apiProductSearch.count
    );
    pagingModel.setStart(1);
    pagingModel.setPageSize(100);

    var iter = pagingModel.pageElements;
    while (iter !== null && iter.hasNext()) {
        productSearchHit = iter.next();
        product = ProductFactory.get({
            pid: productSearchHit.getProduct().ID,
        });
        products.push(product);
    }

    res.render(template, { products: products, category: category });

    next();
});

module.exports = server.exports();
