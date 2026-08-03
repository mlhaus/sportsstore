"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminCatalogRoutes = void 0;
const models_1 = require("../../data/orm/models");
const validation_1 = require("../../data/validation");
const createAdminCatalogRoutes = (router) => {
    router.get("/table", async (req, resp) => {
        const products = await models_1.ProductModel.find()
            .populate("supplier")
            .populate("category")
            .lean();
        resp.render("admin/product_table", { products });
    });
    router.delete("/:id", async (req, resp) => {
        const id = req.params.id;
        const result = await models_1.ProductModel.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            resp.end();
        }
        else {
            throw Error(`Unexpected deletion count result: ${result.deletedCount}`);
        }
    });
    router.get("/edit/:id", async (req, resp) => {
        const id = req.params.id;
        const product = await models_1.ProductModel.findById(id).lean();
        const data = {
            product: { id: { value: id },
                ...await validation_1.ProductDTOValidator.validate(product) },
            suppliers: await models_1.SupplierModel.find().lean(),
            categories: await models_1.CategoryModel.find().lean()
        };
        resp.render("admin/product_editor", data);
    });
    router.put("/:id", async (req, resp) => {
        const validation = await validation_1.ProductDTOValidator.validate(req.body);
        if ((0, validation_1.isValid)(validation)) {
            await models_1.ProductModel.findByIdAndUpdate(req.params.id, (0, validation_1.getData)(validation));
            resp.redirect(303, "/api/products/table");
        }
        else {
            resp.render("admin/product_editor", {
                product: { id: { value: req.params.id }, ...validation },
                suppliers: await models_1.SupplierModel.find().lean(),
                categories: await models_1.CategoryModel.find().lean()
            });
        }
    });
    router.get("/create", async (req, resp) => {
        const data = {
            product: {},
            suppliers: await models_1.SupplierModel.find().lean(),
            categories: await models_1.CategoryModel.find().lean(),
            create: true
        };
        resp.render("admin/product_editor", data);
    });
    router.post("/create", async (req, resp) => {
        const validation = await validation_1.ProductDTOValidator.validate(req.body);
        if ((0, validation_1.isValid)(validation)) {
            await models_1.ProductModel.create((0, validation_1.getData)(validation));
            resp.redirect(303, "/api/products/table");
        }
        else {
            resp.render("admin/product_editor", {
                product: validation,
                suppliers: await models_1.SupplierModel.find().lean(),
                categories: await models_1.CategoryModel.find().lean(),
                create: true
            });
        }
    });
};
exports.createAdminCatalogRoutes = createAdminCatalogRoutes;
