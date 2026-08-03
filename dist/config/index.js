"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = exports.getEnvironment = exports.getSecret = exports.getConfig = void 0;
const fs_1 = require("fs");
const environment_1 = require("./environment");
Object.defineProperty(exports, "getEnvironment", { enumerable: true, get: function () { return environment_1.getEnvironment; } });
Object.defineProperty(exports, "Env", { enumerable: true, get: function () { return environment_1.Env; } });
const merge_1 = require("./merge");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
// Resolve config file path relative to compiled code (dist/)
// In Vercel: __dirname = /var/task/config, so ../server.config.json = /var/task/server.config.json
// In local: __dirname = dist/config, so ../server.config.json = dist/server.config.json
const configFileName = process.env.SERVER_CONFIG ?? "server.config.json";
const configPath = (0, path_1.join)(__dirname, "..", configFileName);
const data = JSON.parse((0, fs_1.readFileSync)(configPath).toString());
(0, dotenv_1.config)({
    path: (0, environment_1.getEnvironment)().toString() + ".env"
});
try {
    const envFile = (0, environment_1.getEnvironment)().toString() + "." + configFileName;
    const envConfigPath = (0, path_1.join)(__dirname, "..", envFile);
    const envData = JSON.parse((0, fs_1.readFileSync)(envConfigPath).toString());
    (0, merge_1.merge)(data, envData);
}
catch {
    // do nothing - file doesn't exist or isn't readable
}
const getConfig = (path, defaultVal = undefined) => {
    const paths = path.split(":");
    let val = data;
    paths.forEach(p => val = val[p]);
    return val ?? defaultVal;
};
exports.getConfig = getConfig;
const getSecret = (name) => {
    const secret = process.env[name];
    if (secret === undefined) {
        throw new Error(`Undefined secret: ${name}`);
    }
    return secret;
};
exports.getSecret = getSecret;
