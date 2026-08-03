import { Schema, model, Document } from "mongoose";

export interface ICustomer extends Document {
    _id: any;
    name: string;
    email: string;
    federatedId?: string;
}

const customerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    federatedId: { type: String }
});

export const CustomerModel = model<ICustomer>("Customer", customerSchema);
