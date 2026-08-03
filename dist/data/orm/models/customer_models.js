"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    federatedId: { type: String }
});
exports.CustomerModel = (0, mongoose_1.model)("Customer", customerSchema);
