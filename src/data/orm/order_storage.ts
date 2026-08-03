import { Order } from "../order_models"
import { BaseRepo, Constructor } from "./core"
import { AddressModel, OrderModel, ProductSelectionModel } 
    from "./models/order_models";
import { CustomerModel } from "./models/customer_models";
import mongoose from "mongoose";

export function AddOrderStorage<TBase extends 
        Constructor<BaseRepo>>(Base: TBase)  {

    return class extends Base {

        async storeOrder(order: Order): Promise<Order> {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const { id, shipped } = order;
                
                let stored = await OrderModel.findByIdAndUpdate(
                    id,
                    { shipped },
                    { upsert: true, new: true, session }
                );
                
                if (order.customer) {
                    let customer = await CustomerModel.findOne(
                        { email: order.customer.email },
                        null,
                        { session }
                    );
                    
                    if (!customer) {
                        customer = new CustomerModel(order.customer);
                        await customer.save({ session });
                    }
                    
                    stored.customerId = customer._id;
                }

                if (order.address) {
                    let address = await AddressModel.findOne(
                        order.address,
                        null,
                        { session }
                    );
                    
                    if (!address) {
                        address = new AddressModel(order.address);
                        await address.save({ session });
                    }
                    
                    stored.addressId = address._id;
                }

                await stored.save({ session });

                if (order.selections) {
                    const sels = await ProductSelectionModel.insertMany(
                        order.selections.map(s => ({
                            ...s,
                            orderId: stored._id
                        })),
                        { session }
                    );
                    stored.selections = sels;
                }

                await session.commitTransaction();
                return stored;
            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                await session.endSession();
            }
        }
    }
}
