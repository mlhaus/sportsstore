import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    _id: any;
    name: string;
    description: string;
    price: number;
    categoryId?: any;
    supplierId?: any;
    category?: any;
    supplier?: any;
}

export interface ICategory extends Document {
    _id: any;
    name: string;
    products?: IProduct[];
}

export interface ISupplier extends Document {
    _id: any;
    name: string;
    products?: IProduct[];
}

const supplierSchema = new Schema({
    name: { type: String, required: true }
});

const categorySchema = new Schema({
    name: { type: String, required: true }
});

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" }
});

export const ProductModel = model<IProduct>("Product", productSchema);
export const CategoryModel = model<ICategory>("Category", categorySchema);
export const SupplierModel = model<ISupplier>("Supplier", supplierSchema);
