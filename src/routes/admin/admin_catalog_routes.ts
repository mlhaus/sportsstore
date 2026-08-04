import { Router } from "express";
import { CategoryModel, ProductModel, SupplierModel } 
    from "../../data/orm/models";
import { ProductDTOValidator, getData, isValid } from "../../data/validation";

const asId = (value: any) => value?.toString ? value.toString() : value;

const mapLookupValues = (values: any[]) => values.map(value => ({
    ...value,
    id: asId(value._id)
}));

const mapProductValues = (products: any[]) => products.map(product => ({
    ...product,
    id: asId(product._id),
    categoryId: asId(product.categoryId?._id ?? product.categoryId),
    supplierId: asId(product.supplierId?._id ?? product.supplierId),
    category: product.categoryId
        ? { ...product.categoryId, id: asId(product.categoryId._id) }
        : undefined,
    supplier: product.supplierId
        ? { ...product.supplierId, id: asId(product.supplierId._id) }
        : undefined
}));

export const createAdminCatalogRoutes = (router: Router) => {

    router.get("/table", async (req, resp) => {
        const products = await ProductModel.find()
                .populate("supplierId")
                .populate("categoryId")
                .lean() as any[];
        resp.render("admin/product_table", {
            products: mapProductValues(products)
        });
    });

    router.delete("/:id", async (req, resp) => {
        const id = req.params.id;
        const result = await ProductModel.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            resp.end();
        } else {
            throw Error(`Unexpected deletion count result: ${result.deletedCount}`)
        }
    });
    

    router.get("/edit/:id", async (req, resp) => {
        const id = req.params.id;
        const product = await ProductModel.findById(id).lean() as any;
        const data = {
            product: { id: { value: id },
                ...await ProductDTOValidator.validate({
                    ...product,
                    categoryId: asId(product?.categoryId),
                    supplierId: asId(product?.supplierId)
                })},
            suppliers: mapLookupValues(await SupplierModel.find().lean() as any[]),
            categories: mapLookupValues(await CategoryModel.find().lean() as any[])
        };
        resp.render("admin/product_editor", data);
    });

    router.put("/:id", async (req, resp) => {
        const validation = await ProductDTOValidator.validate(req.body);
        if (isValid(validation)) {
            await ProductModel.findByIdAndUpdate(
                req.params.id,
                getData(validation)
            );
            resp.redirect(303, "/api/products/table");
        } else {
            resp.render("admin/product_editor", {
                product: { id: { value: req.params.id} , ...validation },
                suppliers: mapLookupValues(await SupplierModel.find().lean() as any[]),
                categories: mapLookupValues(await CategoryModel.find().lean() as any[])
            })
        }
    });    

    router.get("/create", async (req, resp) => {
        const data = {
            product: {},
            suppliers: mapLookupValues(await SupplierModel.find().lean() as any[]),
            categories: mapLookupValues(await CategoryModel.find().lean() as any[]),
            create: true
        };
        resp.render("admin/product_editor", data);
    });

    router.post("/create", async (req, resp) => {
        const validation = await ProductDTOValidator.validate(req.body);
        if (isValid(validation)) {
            await ProductModel.create(getData(validation));
            resp.redirect(303, "/api/products/table");
        } else {
            resp.render("admin/product_editor", {
                product: validation,
                suppliers: mapLookupValues(await SupplierModel.find().lean() as any[]),
                categories: mapLookupValues(await CategoryModel.find().lean() as any[]),
                create: true
            })
        }
    });   

}
