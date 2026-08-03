"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.ProductSelectionModel = exports.AddressModel = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
});
const productSelectionSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true }
});
const orderSchema = new mongoose_1.Schema({
    shipped: { type: Boolean, default: false },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Customer", required: true },
    addressId: { type: mongoose_1.Schema.Types.ObjectId, required: true }
});
exports.AddressModel = (0, mongoose_1.model)("Address", addressSchema);
exports.ProductSelectionModel = (0, mongoose_1.model)("ProductSelection", productSelectionSchema);
exports.OrderModel = (0, mongoose_1.model)("Order", orderSchema);
