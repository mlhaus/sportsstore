import { Router } from "express";
import { CategoryModel, ProductModel, SupplierModel } 
    from "../../data/orm/models";
import { ProductDTOValidator, getData, isValid } from "../../data/validation";

export const createAdminCatalogRoutes = (router: Router) => {

    router.get("/table", async (req, resp) => {
        const products = await ProductModel.find()
                .populate("supplier")
                .populate("category")
                .lean();
        resp.render("admin/product_table", { products });
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
        const product = await ProductModel.findById(id).lean();
        const data = {
            product: { id: { value: id },
                ...await ProductDTOValidator.validate(product)},
            suppliers: await SupplierModel.find().lean(),
            categories: await CategoryModel.find().lean()
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
                suppliers: await SupplierModel.find().lean(),
                categories: await CategoryModel.find().lean()
            })
        }
    });    

    router.get("/create", async (req, resp) => {
        const data = {
            product: {},
            suppliers: await SupplierModel.find().lean(),
            categories: await CategoryModel.find().lean(),
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
                suppliers: await SupplierModel.find().lean(),
                categories: await CategoryModel.find().lean(),
                create: true
            })
        }
    });   

}
