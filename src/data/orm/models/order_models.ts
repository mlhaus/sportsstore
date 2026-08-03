import { Schema, model, Document } from "mongoose";

export interface IAddress extends Document {
    _id: any;
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface IProductSelection extends Document {
    _id: any;
    productId?: any;
    product?: any;
    quantity: number;
    price: number;
    orderId?: any;
    order?: any;
}

export interface IOrder extends Document {
    _id: any;
    shipped: boolean;
    customerId?: any;
    customer?: any;
    addressId?: any;
    address?: any;
    selections?: IProductSelection[];
}

const addressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
});

const productSelectionSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true }
});

const orderSchema = new Schema({
    shipped: { type: Boolean, default: false },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    addressId: { type: Schema.Types.ObjectId, ref: "Address", required: true }
});

productSelectionSchema.virtual("product", {
    ref: "Product",
    localField: "productId",
    foreignField: "_id",
    justOne: true
});

orderSchema.virtual("customer", {
    ref: "Customer",
    localField: "customerId",
    foreignField: "_id",
    justOne: true
});

orderSchema.virtual("address", {
    ref: "Address",
    localField: "addressId",
    foreignField: "_id",
    justOne: true
});

orderSchema.virtual("selections", {
    ref: "ProductSelection",
    localField: "_id",
    foreignField: "orderId"
});

export const AddressModel = model<IAddress>("Address", addressSchema);
export const ProductSelectionModel = model<IProductSelection>("ProductSelection", productSelectionSchema);
export const OrderModel = model<IOrder>("Order", orderSchema);
