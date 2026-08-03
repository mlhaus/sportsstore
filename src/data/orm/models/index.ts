import { initializeCatalogModels } from "./catalog_helpers";
import { initializeCustomerModels } from "./customer_helpers";
import { initializeOrderModels } from "./order_helpers";

export { ProductModel, CategoryModel, SupplierModel } from "./catalog_models";

export const initializeModels = () => {
    initializeCatalogModels();
    initializeCustomerModels();
    initializeOrderModels();
}
