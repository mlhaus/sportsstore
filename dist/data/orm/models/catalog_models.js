"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierModel = exports.CategoryModel = exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const supplierSchema = new mongoose_1.Schema({
    name: { type: String, required: true }
});
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true }
});
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
    supplierId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Supplier" }
});
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
exports.CategoryModel = (0, mongoose_1.model)("Category", categorySchema);
exports.SupplierModel = (0, mongoose_1.model)("Supplier", supplierSchema);
