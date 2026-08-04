import { Router } from "express";
import { OrderModel } from "../../data/orm/models/order_models";
import "../../data/orm/models/customer_models";
import "../../data/orm/models/catalog_models";

const asId = (value: any) => value?.toString ? value.toString() : value;

const mapOrders = (orders: any[]) => orders.map(order => ({
    ...order,
    id: asId(order._id),
    customerId: asId(order.customerId),
    addressId: asId(order.addressId),
    selections: (order.selections ?? []).map((selection: any) => ({
        ...selection,
        id: asId(selection._id),
        productId: asId(selection.productId?._id ?? selection.productId),
        orderId: asId(selection.orderId),
        product: selection.product
            ? { ...selection.product, id: asId(selection.product._id) }
            : undefined
    }))
}));

export const createAdminOrderRoutes = (router: Router) => {

    router.get("/table", async (req, resp) => {
        const orders = await OrderModel.find()
            .populate("customer")
            .populate("address")
            .populate({
                path: "selections",
                populate: {
                    path: "product"
                }
            })
            .sort({ shipped: 1, _id: 1 })
            .lean() as any[];

        resp.render("admin/order_table", { orders: mapOrders(orders) });
    });

    router.post("/ship", async (req, resp) => {
        const { id, shipped } = req.body;
        const result = await OrderModel.findByIdAndUpdate(
            id,
            { shipped },
            { returnDocument: "after" }
        );
        
        if (result) {
            resp.redirect(303, "/api/orders/table");
        } else {
            throw new Error(`Order not found: ${id}`);
        }
    });
}
