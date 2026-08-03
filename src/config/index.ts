import { readFileSync } from "fs";
import { getEnvironment, Env } from "./environment";
import { merge } from "./merge";
import { config as dotenvconfig } from "dotenv";
import { join } from "path";

// Resolve config file path relative to compiled code (dist/)
// In Vercel: __dirname = /var/task/config, so ../server.config.json = /var/task/server.config.json
// In local: __dirname = dist/config, so ../server.config.json = dist/server.config.json
const configFileName = process.env.SERVER_CONFIG ?? "server.config.json";
const configPath = join(__dirname, "..", configFileName);
const data = JSON.parse(readFileSync(configPath).toString());

dotenvconfig({
    path: getEnvironment().toString() + ".env"
})

try {
    const envFile = getEnvironment().toString() + "." + configFileName;
    const envConfigPath = join(__dirname, "..", envFile);
    const envData = JSON.parse(readFileSync(envConfigPath).toString());
    merge(data, envData);
} catch {
    // do nothing - file doesn't exist or isn't readable
}

export const getConfig = (path: string, defaultVal: any = undefined) => {
    const paths = path.split(":");
    let val = data;
    paths.forEach(p => val = val[p]);
    return val ?? defaultVal;
}

export const getSecret = (name: string) => {
    const secret = process.env[name];
    if (secret === undefined) {
        throw new Error(`Undefined secret: ${name}`);
    }
    return secret;
} 

export { getEnvironment, Env };
