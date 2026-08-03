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
            // Try to find products.json in multiple locations
            // 1. In dist directory (for Vercel)
            // 2. In project root (for local development)
            let seedFilePath = join(__dirname, '../../', config.seed_file);
            
            let fileContent: string;
            try {
                fileContent = readFileSync(seedFilePath).toString();
            } catch (e) {
                // If not found, try from parent directory
                seedFilePath = join(__dirname, '../../../', config.seed_file);
                fileContent = readFileSync(seedFilePath).toString();
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
