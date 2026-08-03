"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeModels = exports.SupplierModel = exports.CategoryModel = exports.ProductModel = void 0;
const catalog_helpers_1 = require("./catalog_helpers");
const customer_helpers_1 = require("./customer_helpers");
const order_helpers_1 = require("./order_helpers");
var catalog_models_1 = require("./catalog_models");
Object.defineProperty(exports, "ProductModel", { enumerable: true, get: function () { return catalog_models_1.ProductModel; } });
Object.defineProperty(exports, "CategoryModel", { enumerable: true, get: function () { return catalog_models_1.CategoryModel; } });
Object.defineProperty(exports, "SupplierModel", { enumerable: true, get: function () { return catalog_models_1.SupplierModel; } });
const initializeModels = () => {
    (0, catalog_helpers_1.initializeCatalogModels)();
    (0, customer_helpers_1.initializeCustomerModels)();
    (0, order_helpers_1.initializeOrderModels)();
};
exports.initializeModels = initializeModels;
