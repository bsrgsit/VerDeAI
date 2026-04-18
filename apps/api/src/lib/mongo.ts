import mongoose from "mongoose";
import { env } from "../config/env.js";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectMongo(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connecting) {
    connecting = mongoose.connect(env.mongoUri, {
      dbName: env.mongoDbName,
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
  }

  return connecting;
}