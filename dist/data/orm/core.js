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
            // Resolve path to handle both local dev and Vercel deployment
            const seedPath = (0, path_1.resolve)(process.cwd(), config.seed_file);
            const data = JSON.parse((0, fs_1.readFileSync)(seedPath).toString());
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
