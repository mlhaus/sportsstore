import { Customer } from "../customer_models";
import { CustomerRepository } from "../customer_repository";
import { Address } from "../order_models";
import { BaseRepo, Constructor } from "./core"
import { CustomerModel } from "./models/customer_models";
import { AddressModel, OrderModel } from "./models/order_models";

export function AddCustomers<TBase extends 
        Constructor<BaseRepo>>(Base: TBase)  {

    return class extends Base implements CustomerRepository {

        async getCustomer(id: string): Promise<Customer | null> {
            const result = await CustomerModel.findById(id).lean() as any;
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

        async getCustomerByFederatedId(id: string): Promise<Customer | null> {
            const result = await CustomerModel.findOne({ federatedId: id }).lean() as any;
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

        async getCustomerAddress(id: string): Promise<Address | null> {
            const addressIds = await OrderModel.distinct("addressId", { customerId: id });
            if (addressIds.length === 0) {
                return null;
            }

            const result = await AddressModel.findOne({
                _id: { $in: addressIds }
            })
            .sort({ updatedAt: -1 })
            .lean() as any;

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

        async storeCustomer(customer: Customer): Promise<Customer> {
            let data = await CustomerModel.findOne({ email: customer.email });
            
            if (!data) {
                data = new CustomerModel({
                    name: customer.name,
                    email: customer.email,
                    federatedId: customer.federatedId
                });
            } else {
                data.name = customer.name;
                data.email = customer.email;
                data.federatedId = customer.federatedId;
            }
            
            await data.save();
            
            return {
                id: (data as any)._id.toString ? (data as any)._id.toString() : (data as any)._id,
                name: data.name,
                email: data.email,
                federatedId: data.federatedId
            };
        }
    }
}
