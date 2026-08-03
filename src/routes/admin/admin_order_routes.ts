import { Router } from "express";
import { AddressModel, OrderModel, ProductSelectionModel } 
    from "../../data/orm/models/order_models";
import { CustomerModel } from "../../data/orm/models/customer_models";
import { ProductModel } from "../../data/orm/models";

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
            .lean();

        resp.render("admin/order_table", { orders });
    });

    router.post("/ship", async (req, resp) => {
        const { id, shipped } = req.body;
        const result = await OrderModel.findByIdAndUpdate(
            id,
            { shipped },
            { new: true }
        );
        
        if (result) {
            resp.redirect(303, "/api/orders/table");
        } else {
            throw new Error(`Order not found: ${id}`);
        }
    });
}
