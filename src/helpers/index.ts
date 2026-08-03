import { Express } from "express";
import { getConfig } from "../config";
import { engine } from "express-handlebars";
import { join } from "path";
import * as env_helpers from "./env";
import * as catalog_helpers from "./catalog_helpers";
import * as cart_helpers from "./cart_helpers";
import * as order_helpers from "./order_helpers";
import * as admin_helpers from "./admin_helpers";

const config = getConfig("templates:config");

export const createTemplates = (app: Express) => {
    // Resolve templates directory path relative to __dirname
    // In Vercel: __dirname = /var/task/dist/helpers
    //   - ../../ = /var/task/ 
    //   - ../../templates = /var/task/templates ✓
    // In local dev: __dirname = dist/helpers
    //   - ../ = dist
    //   - ../templates = dist/templates ✓
    
    let templatesDir: string;
    if (process.env.VERCEL) {
        // In Vercel, go up 2 levels to reach templates: dist/helpers -> /var/task/ -> templates
        templatesDir = join(__dirname, "../../templates");
        console.log(`[VERCEL] __dirname = ${__dirname}`);
        console.log(`[VERCEL] templatesDir = ${templatesDir}`);
    } else {
        // In local dev, go up 1 level: dist/helpers -> dist/templates
        templatesDir = join(__dirname, "../templates");
    }

    app.set("views", templatesDir);
    app.engine("handlebars", engine({
        ...config, 
        helpers: {...env_helpers, ...catalog_helpers, ...cart_helpers, 
                    ...order_helpers, ...admin_helpers}
    }));
    app.set("view engine", "handlebars");
}
