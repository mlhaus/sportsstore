import mongoose from "mongoose";
import { getConfig, getSecret } from "../../config";
import { initializeModels, CategoryModel, ProductModel, SupplierModel } 
    from "./models";
import { readFileSync } from "fs";
import { join } from "path";

const config = getConfig("catalog:orm_repo");

export class BaseRepo {
    
    constructor() {
        this.initModelsAndDatabase();
    }

    async initModelsAndDatabase() : Promise<void> {
        const mongoUri = getSecret("MONGODB_URI");
        
        try {
            await mongoose.connect(mongoUri, {
                dbName: "sportsstore"
            });
            
            if (config.logging) {
                console.log("Connected to MongoDB");
            }

            initializeModels();

            if (config.reset_db) {
                await this.clearAndSeedData();
            }
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }

    async clearAndSeedData() {
        try {
            // In Vercel, Mongoose is already connected to MongoDB Atlas
            // Skip file-based seeding in production (too fragile with file paths)
            // Data should be pre-seeded in MongoDB or seeded via separate admin script
            if (process.env.NODE_ENV === 'production') {
                if (config.logging) {
                    console.log("Skipping database seeding in production");
                }
                return;
            }

            // Try to find products.json in local development
            const pathsToTry = [
                join(__dirname, '../../', config.seed_file),         // dist/products.json
                join(__dirname, '../../../', config.seed_file),      // root/products.json
                join(__dirname, '../../../../', config.seed_file)    // parent/products.json
            ];
            
            let fileContent: string = '';
            let seedFilePath: string | null = null;
            
            for (const tryPath of pathsToTry) {
                try {
                    fileContent = readFileSync(tryPath).toString();
                    seedFilePath = tryPath;
                    if (config.logging) {
                        console.log(`Found seed file at: ${tryPath}`);
                    }
                    break;
                } catch (e) {
                    if (config.logging) {
                        console.log(`Seed file not found at: ${tryPath}`);
                    }
                }
            }
            
            if (!seedFilePath) {
                throw new Error(`Could not find ${config.seed_file} in any expected location`);
            }
            
            const data = JSON.parse(fileContent);
            
            await SupplierModel.deleteMany({});
            await CategoryModel.deleteMany({});
            await ProductModel.deleteMany({});
            
            const insertedSuppliers = await SupplierModel.insertMany(
                data.suppliers.map((supplier: { name: string }) => ({
                    name: supplier.name
                }))
            );
            const insertedCategories = await CategoryModel.insertMany(
                data.categories.map((category: { name: string }) => ({
                    name: category.name
                }))
            );

            const supplierIds = new Map(
                data.suppliers.map((supplier: { id: number }, index: number) =>
                    [supplier.id, insertedSuppliers[index]._id])
            );
            const categoryIds = new Map(
                data.categories.map((category: { id: number }, index: number) =>
                    [category.id, insertedCategories[index]._id])
            );

            await ProductModel.insertMany(
                data.products.map((product: {
                    name: string; description: string; price: number;
                    categoryId: number; supplierId: number;
                }) => ({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    categoryId: categoryIds.get(product.categoryId),
                    supplierId: supplierIds.get(product.supplierId)
                }))
            );
            
            if (config.logging) {
                console.log("Database seeded successfully");
            }
        } catch (error) {
            console.error("Failed to seed database:", error);
            throw error;
        }
    }
}

export type Constructor<T = {}> = new (...args: any[]) => T;
