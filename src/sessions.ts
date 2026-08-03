import { Express } from "express";
import { getConfig, getSecret } from "./config";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

const config = getConfig("sessions");
const secret = getSecret("COOKIE_SECRET");
const mongoUri = getSecret("MONGODB_URI");

export const createSessions = (app: Express) => {
    const sessionConfig = {
        secret,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: mongoUri,
            dbName: "sportsstore",
            collectionName: "sessions",
            touchAfter: 24 * 3600
        }),
        cookie: { 
            maxAge: config.maxAgeHrs * 60 * 60 * 1000, 
            sameSite: false as const,
            httpOnly: false,
            secure: false
        }
    };

    if (config.logging) {
        console.log("Session store configured for MongoDB");
    }

    app.use(session(sessionConfig));
}
