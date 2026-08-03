import { createServer } from "http";
import express, { Express } from "express";
import helmet from "helmet";
import { getConfig, getEnvironment, Env } from "./config";
import { createRoutes } from "./routes";
import { createTemplates } from "./helpers";
import { createErrorHandlers } from "./errors";
import { createSessions } from "./sessions";
import { createAuthentication } from "./authentication";
import httpProxy from "http-proxy";
import { join } from "path";

const port = getConfig("http:port", 3000);

const expressApp: Express = express();

expressApp.use(helmet(getConfig("http:content_security", {})));
expressApp.use(express.json());
expressApp.use(express.urlencoded({extended: true}))

// Serve static files from node_modules
// In Vercel: __dirname = /var/task/dist, so we need to go up to /var/task/node_modules
// In local: __dirname = dist, so we need to go up to ./node_modules
expressApp.use(express.static(join(__dirname, "../node_modules/bootstrap/dist")));
expressApp.use(express.static(join(__dirname, "../node_modules/bootstrap-icons")));
expressApp.use(express.static(join(__dirname, "../node_modules/htmx.org/dist")));

createTemplates(expressApp);
createSessions(expressApp);

createAuthentication(expressApp);

createRoutes(expressApp);

const server = createServer(expressApp);

if (getEnvironment() === Env.Development) {
    const proxy = httpProxy.createProxyServer({
        target: "http://localhost:5100", ws: true
    });    
    expressApp.use("/admin", (req, resp) => proxy.web(req, resp));
    server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));
}

createErrorHandlers(expressApp);

server.listen(port, 
    () => console.log(`HTTP Server listening on port ${port}`));

export default expressApp;