"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStorage = AddStorage;
const models_1 = require("./models");
function AddStorage(Base) {
    return class extends Base {
        async storeProduct(p) {
            if (p.category) {
                p.category = await this.storeCategory(p.category);
            }
            if (p.supplier) {
                p.supplier = await this.storeSupplier(p.supplier);
            }
            const stored = await models_1.ProductModel.findByIdAndUpdate(p.id, {
                name: p.name,
                description: p.description,
                price: p.price,
                categoryId: p.category?.id,
                supplierId: p.supplier?.id
            }, { upsert: true, new: true });
            return stored;
        }
        async storeCategory(c) {
            const stored = await models_1.CategoryModel.findByIdAndUpdate(c.id, { name: c.name }, { upsert: true, new: true });
            return stored;
        }
        async storeSupplier(s) {
            const stored = await models_1.SupplierModel.findByIdAndUpdate(s.id, { name: s.name }, { upsert: true, new: true });
            return stored;
        }
    };
}
