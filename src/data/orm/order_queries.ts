import { Order } from "../order_models"
import { BaseRepo, Constructor } from "./core"
import { AddressModel, OrderModel } from "./models/order_models";
import { CustomerModel } from "./models/customer_models";

export function AddOrderQueries<TBase 
        extends Constructor<BaseRepo>>(Base: TBase)  {

    return class extends Base {

        async getOrder(id: string) : Promise<Order | null> {
            const result = await OrderModel.findById(id)
                .populate("address")
                .populate("customer")
                .lean() as any;
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

        async getOrders(excludeShipped: boolean): Promise<Order[]> {
            const filter = excludeShipped ? { shipped: false } : {};
            const results = await OrderModel.find(filter)
                .populate("address")
                .populate("customer")
                .lean() as any[];

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
    }
}
