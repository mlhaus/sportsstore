"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessions = void 0;
const config_1 = require("./config");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const config = (0, config_1.getConfig)("sessions");
const secret = (0, config_1.getSecret)("COOKIE_SECRET");
const mongoUri = (0, config_1.getSecret)("MONGODB_URI");
const createSessions = (app) => {
    const sessionConfig = {
        secret,
        resave: false,
        saveUninitialized: true,
        store: connect_mongo_1.default.create({
            mongoUrl: mongoUri,
            dbName: "sportsstore",
            collectionName: "sessions",
            touchAfter: 24 * 3600
        }),
        cookie: {
            maxAge: config.maxAgeHrs * 60 * 60 * 1000,
            sameSite: false,
            httpOnly: false,
            secure: false
        }
    };
    if (config.logging) {
        console.log("Session store configured for MongoDB");
    }
    app.use((0, express_session_1.default)(sessionConfig));
};
exports.createSessions = createSessions;
