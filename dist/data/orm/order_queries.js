"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOrderQueries = AddOrderQueries;
const order_models_1 = require("./models/order_models");
function AddOrderQueries(Base) {
    return class extends Base {
        async getOrder(id) {
            const result = await order_models_1.OrderModel.findById(id)
                .populate("address")
                .populate("customer")
                .lean();
            if (result) {
                return {
                    id: result._id.toString ? result._id.toString() : result._id,
                    shipped: result.shipped,
                    customerId: result.customerId?.toString ? result.customerId.toString() : result.customerId,
                    addressId: result.addressId?.toString ? result.addressId.toString() : result.addressId,
                    customer: result.customer,
                    address: result.address,
                    selections: result.selections
                };
            }
            return null;
        }
        async getOrders(excludeShipped) {
            const filter = excludeShipped ? { shipped: false } : {};
            const results = await order_models_1.OrderModel.find(filter)
                .populate("address")
                .populate("customer")
                .lean();
            return results.map(o => ({
                id: o._id.toString ? o._id.toString() : o._id,
                shipped: o.shipped,
                customerId: o.customerId?.toString ? o.customerId.toString() : o.customerId,
                addressId: o.addressId?.toString ? o.addressId.toString() : o.addressId,
                customer: o.customer,
                address: o.address,
                selections: o.selections
            }));
        }
    };
}
