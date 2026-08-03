"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddQueries = AddQueries;
const models_1 = require("./models");
const mongoose_1 = __importDefault(require("mongoose"));
function AddQueries(Base) {
    return class extends Base {
        async getProducts(params) {
            const filter = {};
            if (params?.searchTerm) {
                filter.$or = [
                    { name: { $regex: params.searchTerm, $options: "i" } },
                    { description: { $regex: params.searchTerm, $options: "i" } }
                ];
            }
            if (params?.category) {
                filter.categoryId = params.category;
            }
            const skip = params?.page && params?.pageSize
                ? (params.page - 1) * params.pageSize
                : 0;
            const limit = params?.pageSize || 0;
            const products = await models_1.ProductModel.find(filter)
                .populate("supplierId")
                .populate("categoryId")
                .skip(skip)
                .limit(limit)
                .lean();
            const totalCount = await models_1.ProductModel.countDocuments(filter);
            const categories = await this.getCategories();
            return {
                products: products.map(p => ({
                    ...p,
                    id: p._id.toString ? p._id.toString() : p._id,
                    categoryId: p.categoryId?.toString ? p.categoryId.toString() : p.categoryId,
                    supplierId: p.supplierId?.toString ? p.supplierId.toString() : p.supplierId
                })),
                totalCount,
                categories
            };
        }
        async getCategories() {
            const results = await models_1.CategoryModel.find().lean();
            return results.map(c => ({
                ...c,
                id: c._id.toString ? c._id.toString() : c._id
            }));
        }
        async getSuppliers() {
            const results = await models_1.SupplierModel.find().lean();
            return results.map(s => ({
                ...s,
                id: s._id.toString ? s._id.toString() : s._id
            }));
        }
        async getProductDetails(ids) {
            const validIds = ids.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
            if (validIds.length === 0) {
                return [];
            }
            const results = await models_1.ProductModel.find({ _id: { $in: validIds } }).lean();
            return results.map(p => ({
                ...p,
                id: p._id.toString ? p._id.toString() : p._id,
                categoryId: p.categoryId?.toString ? p.categoryId.toString() : p.categoryId,
                supplierId: p.supplierId?.toString ? p.supplierId.toString() : p.supplierId
            }));
        }
    };
}
