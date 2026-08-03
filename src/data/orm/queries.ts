import { CategoryModel, ProductModel, SupplierModel } from "./models";
import { BaseRepo, Constructor } from "./core"
import { ProductQueryParameters } from "../catalog_models";

export function AddQueries<TBase extends Constructor<BaseRepo>>(Base: TBase) {
    return class extends Base {
    
        async getProducts(params?: ProductQueryParameters) {
            const filter: any = {};
            
            if(params?.searchTerm) {
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
            
            const products = await ProductModel.find(filter)
                .populate("supplier")
                .populate("category")
                .skip(skip)
                .limit(limit)
                .lean() as any[];
                
            const totalCount = await ProductModel.countDocuments(filter);
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
            const results = await CategoryModel.find().lean() as any[];
            return results.map(c => ({
                ...c,
                id: c._id.toString ? c._id.toString() : c._id
            }));
        }
    
        async getSuppliers() {
            const results = await SupplierModel.find().lean() as any[];
            return results.map(s => ({
                ...s,
                id: s._id.toString ? s._id.toString() : s._id
            }));
        }        

        async getProductDetails(ids: string[]) {
            const results = await ProductModel.find({ _id: { $in: ids } }).lean() as any[];
            return results.map(p => ({
                ...p,
                id: p._id.toString ? p._id.toString() : p._id,
                categoryId: p.categoryId?.toString ? p.categoryId.toString() : p.categoryId,
                supplierId: p.supplierId?.toString ? p.supplierId.toString() : p.supplierId
            }));
        }
    }
}
