import { Order } from "./order_models";

export interface OrderRepository {

    getOrder(id: string): Promise<Order| null>;

    getOrders(excludeShipped: boolean): Promise<Order[]>;

    storeOrder(order: Order): Promise<Order>;
}
