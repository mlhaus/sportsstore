"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminOrderRoutes = void 0;
const order_models_1 = require("../../data/orm/models/order_models");
require("../../data/orm/models/customer_models");
require("../../data/orm/models/catalog_models");
const asId = (value) => value?.toString ? value.toString() : value;
const mapOrders = (orders) => orders.map(order => ({
    ...order,
    id: asId(order._id),
    customerId: asId(order.customerId),
    addressId: asId(order.addressId),
    selections: (order.selections ?? []).map((selection) => ({
        ...selection,
        id: asId(selection._id),
        productId: asId(selection.productId?._id ?? selection.productId),
        orderId: asId(selection.orderId),
        product: selection.product
            ? { ...selection.product, id: asId(selection.product._id) }
            : undefined
    }))
}));
const createAdminOrderRoutes = (router) => {
    router.get("/table", async (req, resp) => {
        const orders = await order_models_1.OrderModel.find()
            .populate("customer")
            .populate("address")
            .populate({
            path: "selections",
            populate: {
                path: "product"
            }
        })
            .sort({ shipped: 1, _id: 1 })
            .lean();
        resp.render("admin/order_table", { orders: mapOrders(orders) });
    });
    router.post("/ship", async (req, resp) => {
        const { id, shipped } = req.body;
        const result = await order_models_1.OrderModel.findByIdAndUpdate(id, { shipped }, { returnDocument: "after" });
        if (result) {
            resp.redirect(303, "/api/orders/table");
        }
        else {
            throw new Error(`Order not found: ${id}`);
        }
    });
};
exports.createAdminOrderRoutes = createAdminOrderRoutes;
