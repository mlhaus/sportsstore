"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCustomers = AddCustomers;
const customer_models_1 = require("./models/customer_models");
const order_models_1 = require("./models/order_models");
function AddCustomers(Base) {
    return class extends Base {
        async getCustomer(id) {
            const result = await customer_models_1.CustomerModel.findById(id).lean();
            if (result) {
                return {
                    id: result._id.toString ? result._id.toString() : result._id,
                    name: result.name,
                    email: result.email,
                    federatedId: result.federatedId
                };
            }
            return null;
        }
        async getCustomerByFederatedId(id) {
            const result = await customer_models_1.CustomerModel.findOne({ federatedId: id }).lean();
            if (result) {
                return {
                    id: result._id.toString ? result._id.toString() : result._id,
                    name: result.name,
                    email: result.email,
                    federatedId: result.federatedId
                };
            }
            return null;
        }
        async getCustomerAddress(id) {
            const addressIds = await order_models_1.OrderModel.distinct("addressId", { customerId: id });
            if (addressIds.length === 0) {
                return null;
            }
            const result = await order_models_1.AddressModel.findOne({
                _id: { $in: addressIds }
            })
                .sort({ updatedAt: -1 })
                .lean();
            if (result) {
                return {
                    id: result._id.toString ? result._id.toString() : result._id,
                    street: result.street,
                    city: result.city,
                    state: result.state,
                    zip: result.zip
                };
            }
            return null;
        }
        async storeCustomer(customer) {
            let data = await customer_models_1.CustomerModel.findOne({ email: customer.email });
            if (!data) {
                data = new customer_models_1.CustomerModel({
                    name: customer.name,
                    email: customer.email,
                    federatedId: customer.federatedId
                });
            }
            else {
                data.name = customer.name;
                data.email = customer.email;
                data.federatedId = customer.federatedId;
            }
            await data.save();
            return {
                id: data._id.toString ? data._id.toString() : data._id,
                name: data.name,
                email: data.email,
                federatedId: data.federatedId
            };
        }
    };
}
