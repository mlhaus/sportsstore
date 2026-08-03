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
            // Try to find products.json in multiple locations:
            // 1. Same directory as compiled core.js (dist/data/orm/)
            // 2. dist/ directory (copied by copy-assets.js)
            // 3. Project root (for local development)
            const pathsToTry = [
                join(__dirname, '../../../', config.seed_file),    // dist/products.json
                join(__dirname, '../../../../', config.seed_file),  // project root/products.json
                join(__dirname, '../../../../../../', config.seed_file) // fallback
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
                    // Continue to next path
                }
            }
            
            if (!seedFilePath) {
                throw new Error(`Could not find ${config.seed_file} in any expected location`);
            }
            
            const data = JSON.parse(fileContent);
            
            await SupplierModel.deleteMany({});
            await CategoryModel.deleteMany({});
            await ProductModel.deleteMany({});
            
            await SupplierModel.insertMany(data.suppliers);
            await CategoryModel.insertMany(data.categories);
            await ProductModel.insertMany(data.products);
            
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
