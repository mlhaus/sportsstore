"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../config");
const models_1 = require("./models");
const fs_1 = require("fs");
const path_1 = require("path");
const config = (0, config_1.getConfig)("catalog:orm_repo");
class BaseRepo {
    constructor() {
        this.initModelsAndDatabase();
    }
    async initModelsAndDatabase() {
        const mongoUri = (0, config_1.getSecret)("MONGODB_URI");
        try {
            await mongoose_1.default.connect(mongoUri, {
                dbName: "sportsstore"
            });
            if (config.logging) {
                console.log("Connected to MongoDB");
            }
            (0, models_1.initializeModels)();
            if (config.reset_db) {
                await this.clearAndSeedData();
            }
        }
        catch (error) {
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
                (0, path_1.join)(__dirname, '../../../', config.seed_file), // dist/products.json
                (0, path_1.join)(__dirname, '../../../../', config.seed_file), // project root/products.json
                (0, path_1.join)(__dirname, '../../../../../../', config.seed_file) // fallback
            ];
            let fileContent = '';
            let seedFilePath = null;
            for (const tryPath of pathsToTry) {
                try {
                    fileContent = (0, fs_1.readFileSync)(tryPath).toString();
                    seedFilePath = tryPath;
                    if (config.logging) {
                        console.log(`Found seed file at: ${tryPath}`);
                    }
                    break;
                }
                catch (e) {
                    // Continue to next path
                }
            }
            if (!seedFilePath) {
                throw new Error(`Could not find ${config.seed_file} in any expected location`);
            }
            const data = JSON.parse(fileContent);
            await models_1.SupplierModel.deleteMany({});
            await models_1.CategoryModel.deleteMany({});
            await models_1.ProductModel.deleteMany({});
            await models_1.SupplierModel.insertMany(data.suppliers);
            await models_1.CategoryModel.insertMany(data.categories);
            await models_1.ProductModel.insertMany(data.products);
            if (config.logging) {
                console.log("Database seeded successfully");
            }
        }
        catch (error) {
            console.error("Failed to seed database:", error);
            throw error;
        }
    }
}
exports.BaseRepo = BaseRepo;
