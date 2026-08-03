import { Product } from "./catalog_models";
import { Customer } from "./customer_models";

export interface Order {
    id?: string;

    customer?: Customer;
    selections?: ProductSelection[];
    address?: Address;

    customerId?: string;
    addressId?: string;
    shipped: boolean;
}

export interface ProductSelection {
    id?: string;
    productId?: string;
    quantity: number;
    price: number;
    orderId?: string;
}

export interface Address {
    id?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
}
