import { Category, Product, Supplier } from "../catalog_models";
import { CategoryModel, ProductModel, SupplierModel } from "./models";
import { BaseRepo, Constructor } from "./core"

export function AddStorage<TBase extends Constructor<BaseRepo>>(Base: TBase)  {
    return class extends Base {

        async storeProduct(p: Product) {
            if (p.category) {
                p.category = await this.storeCategory(p.category)
            }
            if (p.supplier) {
                p.supplier = await this.storeSupplier(p.supplier);
            }
            
            const stored = await ProductModel.findByIdAndUpdate(
                p.id,
                {
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    categoryId: p.category?.id,
                    supplierId: p.supplier?.id
                },
                { upsert: true, new: true }
            );
            return stored;
        }
    
        async storeCategory(c: Category) {
            const stored = await CategoryModel.findByIdAndUpdate(
                c.id,
                { name: c.name },
                { upsert: true, new: true }
            );
            return stored;
        }
    
        async storeSupplier(s: Supplier) {
            const stored = await SupplierModel.findByIdAndUpdate(
                s.id,
                { name: s.name },
                { upsert: true, new: true }
            );
            return stored;
        }       
    }
}
