import { Customer } from "./customer_models";
import { Address } from "./order_models";

export interface CustomerRepository {

    getCustomer(id: string) : Promise<Customer | null>;

    getCustomerByFederatedId(id: string): Promise<Customer | null>;

    getCustomerAddress(id: string): Promise<Address | null>;

    storeCustomer(customer: Customer): Promise<Customer>;
}
