"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOrderStorage = AddOrderStorage;
const order_models_1 = require("./models/order_models");
const customer_models_1 = require("./models/customer_models");
const mongoose_1 = __importDefault(require("mongoose"));
function AddOrderStorage(Base) {
    return class extends Base {
        async storeOrder(order) {
            const session = await mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const { id, shipped } = order;
                let stored = await order_models_1.OrderModel.findByIdAndUpdate(id, { shipped }, { upsert: true, new: true, session });
                if (order.customer) {
                    let customer = await customer_models_1.CustomerModel.findOne({ email: order.customer.email }, null, { session });
                    if (!customer) {
                        customer = new customer_models_1.CustomerModel(order.customer);
                        await customer.save({ session });
                    }
                    stored.customerId = customer._id;
                }
                if (order.address) {
                    let address = await order_models_1.AddressModel.findOne(order.address, null, { session });
                    if (!address) {
                        address = new order_models_1.AddressModel(order.address);
                        await address.save({ session });
                    }
                    stored.addressId = address._id;
                }
                await stored.save({ session });
                if (order.selections) {
                    const sels = await order_models_1.ProductSelectionModel.insertMany(order.selections.map(s => ({
                        ...s,
                        orderId: stored._id
                    })), { session });
                    stored.selections = sels;
                }
                await session.commitTransaction();
                return stored;
            }
            catch (error) {
                await session.abortTransaction();
                throw error;
            }
            finally {
                await session.endSession();
            }
        }
    };
}
