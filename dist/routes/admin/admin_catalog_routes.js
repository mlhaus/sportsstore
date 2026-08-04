"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminCatalogRoutes = void 0;
const models_1 = require("../../data/orm/models");
const validation_1 = require("../../data/validation");
const asId = (value) => value?.toString ? value.toString() : value;
const mapLookupValues = (values) => values.map(value => ({
    ...value,
    id: asId(value._id)
}));
const mapProductValues = (products) => products.map(product => ({
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
const createAdminCatalogRoutes = (router) => {
    router.get("/table", async (req, resp) => {
        const products = await models_1.ProductModel.find()
            .populate("supplierId")
            .populate("categoryId")
            .lean();
        resp.render("admin/product_table", {
            products: mapProductValues(products)
        });
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
                ...await validation_1.ProductDTOValidator.validate({
                    ...product,
                    categoryId: asId(product?.categoryId),
                    supplierId: asId(product?.supplierId)
                }) },
            suppliers: mapLookupValues(await models_1.SupplierModel.find().lean()),
            categories: mapLookupValues(await models_1.CategoryModel.find().lean())
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
                suppliers: mapLookupValues(await models_1.SupplierModel.find().lean()),
                categories: mapLookupValues(await models_1.CategoryModel.find().lean())
            });
        }
    });
    router.get("/create", async (req, resp) => {
        const data = {
            product: {},
            suppliers: mapLookupValues(await models_1.SupplierModel.find().lean()),
            categories: mapLookupValues(await models_1.CategoryModel.find().lean()),
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
                suppliers: mapLookupValues(await models_1.SupplierModel.find().lean()),
                categories: mapLookupValues(await models_1.CategoryModel.find().lean()),
                create: true
            });
        }
    });
};
exports.createAdminCatalogRoutes = createAdminCatalogRoutes;
