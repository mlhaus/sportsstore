"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplates = void 0;
const config_1 = require("../config");
const express_handlebars_1 = require("express-handlebars");
const path_1 = require("path");
const env_helpers = __importStar(require("./env"));
const catalog_helpers = __importStar(require("./catalog_helpers"));
const cart_helpers = __importStar(require("./cart_helpers"));
const order_helpers = __importStar(require("./order_helpers"));
const admin_helpers = __importStar(require("./admin_helpers"));
const config = (0, config_1.getConfig)("templates:config");
const createTemplates = (app) => {
    // Resolve templates directory path relative to __dirname
    // In Vercel: __dirname = /var/task/dist/helpers
    //   - ../.. = /var/task/dist
    //   - ../../.. = /var/task/ (then ../templates = /var/task/templates)
    // In local dev: __dirname = dist/helpers
    //   - ../.. = dist
    //   - ../../.. would go to parent, use ../ instead = dist/templates
    let templatesDir;
    if (process.env.VERCEL) {
        // In Vercel, go up 3 levels to escape dist/ nesting: dist/helpers -> /var/task/templates
        templatesDir = (0, path_1.join)(__dirname, "../../../templates");
        console.log(`[VERCEL] __dirname = ${__dirname}`);
        console.log(`[VERCEL] templatesDir = ${templatesDir}`);
    }
    else {
        // In local dev, go up 1 level: dist/helpers -> dist/templates
        templatesDir = (0, path_1.join)(__dirname, "../templates");
    }
    app.set("views", templatesDir);
    app.engine("handlebars", (0, express_handlebars_1.engine)({
        ...config,
        helpers: { ...env_helpers, ...catalog_helpers, ...cart_helpers,
            ...order_helpers, ...admin_helpers }
    }));
    app.set("view engine", "handlebars");
};
exports.createTemplates = createTemplates;
