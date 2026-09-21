import mongoose from "mongoose";
import { env } from "../config/env.ts";

export async function connectDB(uri: string = env.MONGO_URI) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
